import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients/clients.service';
import { ClientCardComponent } from '../client-card/client-card.component';
import { Client } from '../../models/clientsModel';
import { Router } from '@angular/router';
import { ClientsMapComponent } from '../clients-map/clients-map.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from '../../../../core/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SortControlsComponent } from '../../../../shared/components/sort-controls/sort-controls.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [ClientCardComponent, ClientsMapComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private clientsService: ClientsService, private router: Router) {}

  ngOnInit() {
    this.clientsService.getAllClientsWithParams().subscribe({
      next: (response) => {
        this.clients = response.clients;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error desconocido';
        this.isLoading = false;
      },
    });
  }
}
