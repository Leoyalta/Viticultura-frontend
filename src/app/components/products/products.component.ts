import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductQueryParams } from '../../models/productsModel';
import { ProductsService } from '../../services/products/products.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SortControlsComponent } from '../shared/sort-controls/sort-controls.component';
import { ProductsFiltersComponent } from '../filters/products-filters/products-filters.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PaginatorComponent,
    SortControlsComponent,
    ProductsFiltersComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  errorMessage = '';
  isLoading = false;
  screenWidth = window.innerWidth;

  totalProducts = 0;
  pageSize = 20;
  pageIndex = 0;
  // filters: any = {};

  private subscription!: Subscription;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });

    this.subscription = this.productsService.queryParams$.subscribe(
      (params) => {
        this.fetchProducts();
      }
    );

    this.productsService.updateQueryParams({});
  }

  fetchProducts(): void {
    this.isLoading = true;

    this.productsService.getAllProductsWithParams().subscribe({
      next: (res) => {
        this.products = res.products;
        this.totalProducts = res.totalProducts;
        this.pageSize = res.per_page;
        this.pageIndex = res.page - 1;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.productsService.updateQueryParams({
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
    this.productsService.updateQueryParams({ sortBy, sortOrder });
  }
  onFiltersChange(filters: any): void {
    this.productsService.updateQueryParams({ ...filters, page: 1 });
  }
  goToDetails(id: string) {
    this.router.navigate(['/product', id]);
  }

  goToAddProduct() {
    this.router.navigate(['/addNewProduct']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
