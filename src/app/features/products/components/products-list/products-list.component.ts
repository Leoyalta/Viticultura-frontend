import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/productsModel';
import { ProductsService } from '../../services/products/products.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SortControlsComponent } from '../../../../shared/components/sort-controls/sort-controls.component';

import { Subscription } from 'rxjs';
import { FiltersDrawerComponent } from '../../../../shared/components/filters-drawer/filters-drawer.component';
import { ProductsFiltersComponent } from '../../filters/products-filters/products-filters.component';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SpinnerComponent,
    PaginatorComponent,
    SortControlsComponent,
    FiltersDrawerComponent,
    ProductsFiltersComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  errorMessage = '';
  isLoading = false;
  screenWidth = window.innerWidth;

  totalProducts = 0;
  pageSize = 20;
  pageIndex = 0;

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
