import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../services/clients/clients.service';
import { Client } from '../../models/clientsModel';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-profile',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss',
})
export class ClientProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientsService);

  client: Client | null = null;
  locations: Location[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no proporcionado';
      return;
    }

    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
        // this.fetchLocations(client._id);
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      },
    });
  }

  // fetchLocations(ownerId: string) {
  //   this.clientService.getClientLocations(ownerId).subscribe({
  //     next: (locs) => {
  //       this.locations = locs;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.error = err.message;
  //       this.isLoading = false;
  //     },
  //   });
  // }
}
