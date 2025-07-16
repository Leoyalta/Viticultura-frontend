// src/app/order-list/order-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Order } from '../../models/ordersModel';
import { catchError, of, switchMap, Subscription, BehaviorSubject } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SortControlsComponent } from '../../../../shared/components/sort-controls/sort-controls.component';
import { FiltersDrawerComponent } from '../../../../shared/components/filters-drawer/filters-drawer.component';
import { OrdersFiltersComponent } from '../orders-filters/orders-filters.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    OrderCardComponent,
    SpinnerComponent,
    PaginatorComponent,
    SortControlsComponent,
    FiltersDrawerComponent,
    OrdersFiltersComponent,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  totalOrders = 0;
  pageSize = 20;
  pageIndex = 0;

  private subscription!: Subscription;

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.ordersService.queryParams$
      .pipe(
        switchMap(() => {
          this.isLoading = true;
          return this.ordersService.getAllOrdersWithParams().pipe(
            catchError((err) => {
              this.errorMessage =
                err.message || 'No se pudieron cargar los pedidos.';
              this.isLoading = false;
              return of(null);
            })
          );
        })
      )
      .subscribe((response) => {
        if (response) {
          this.orders = response.orders;
          this.totalOrders = response.totalOrders;
          this.pageSize = response.per_page;
          this.pageIndex = response.page - 1;
        }
        this.isLoading = false;
      });

    this.ordersService.updateQueryParams({
      page: this.pageIndex + 1,
      per_page: this.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }

  onPageChange(event: PageEvent): void {
    this.ordersService.updateQueryParams({
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
  }): void {
    this.ordersService.updateQueryParams({ sortBy, sortOrder, page: 1 });
  }

  onFiltersChange(filters: any): void {
    this.ordersService.updateQueryParams({ ...filters, page: 1 });
  }

  goToAddOrder(): void {
    this.router.navigate(['/addNewOrder']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
