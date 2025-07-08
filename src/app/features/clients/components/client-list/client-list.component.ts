import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients/clients.service';
import { ClientCardComponent } from '../client-card/client-card.component';
import { Client } from '../../models/clientsModel';
import { Router } from '@angular/router';
import { ClientsMapComponent } from '../clients-map/clients-map.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SortControlsComponent } from '../../../../shared/components/sort-controls/sort-controls.component';
import { ClientsFiltersComponent } from '../clients-filters/clients-filters.component';
import { FiltersDrawerComponent } from '../../../../shared/components/filters-drawer/filters-drawer.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    ClientCardComponent,
    ClientsMapComponent,
    SpinnerComponent,
    PaginatorComponent,
    SortControlsComponent,
    ClientsFiltersComponent,
    FiltersDrawerComponent,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  error: string | null = null;

  totalProducts = 0;
  pageSize = 20;
  pageIndex = 0;

  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private clientsService: ClientsService, private router: Router) {}

  ngOnInit() {
    this.clientsService.queryParams$.subscribe(() => {
      this.fetchClients();
    });

    this.clientsService.updateQueryParams({});
  }

  fetchClients(): void {
    this.isLoading = true;
    this.clientsService.getAllClientsWithParams().subscribe({
      next: (response) => {
        this.clients = response.clients;
        this.totalProducts = response.totalClients;
        this.pageSize = response.per_page;
        this.pageIndex = response.page - 1;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error desconocido';
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.clientsService.updateQueryParams({
      page: event.pageIndex + 1,
      per_page: event.pageSize,
    });
  }

  onSortChange({
    sortBy,
    sortOrder,
  }: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    this.clientsService.updateQueryParams({ sortBy, sortOrder });
  }
  goToAddClient(): void {
    this.router.navigate(['/addNewClient']);
  }
  onFiltersChange(filters: any): void {
    this.clientsService.updateQueryParams({ ...filters, page: 1 });
  }
}
