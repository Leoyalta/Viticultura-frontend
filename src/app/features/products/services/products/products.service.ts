// src/app/services/products.service.ts (або де він у вас знаходиться)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  Product,
  ProductsResponse,
  ProductQueryParams,
} from '../../models/productsModel';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly API_URL =
    'https://viticultura-backend.onrender.com/products';

  constructor(private http: HttpClient) {}

  private queryParamsSubject = new BehaviorSubject<ProductQueryParams>({
    page: 1,
    per_page: 20,
  });

  queryParams$ = this.queryParamsSubject.asObservable();

  private filterKeys: (keyof ProductQueryParams)[] = [
    'code',
    'variety',
    'pie',
    'isAvailable',
  ];

  private cleanParams(params: ProductQueryParams): ProductQueryParams {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
      )
    ) as ProductQueryParams;
  }

  updateQueryParams(params: Partial<ProductQueryParams>): void {
    let currentParams = { ...this.queryParamsSubject.value };

    const incomingFilters: Partial<ProductQueryParams> = {};
    const incomingOther: Partial<ProductQueryParams> = {};

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const queryKey = key as keyof ProductQueryParams;
        const value = params[queryKey];

        if (this.filterKeys.includes(queryKey)) {
          (incomingFilters as any)[queryKey] = value;
        } else {
          (incomingOther as any)[queryKey] = value;
        }
      }
    }

    let nextQueryParams: ProductQueryParams = {
      page: 1,
      per_page: currentParams.per_page || 20,
    };

    Object.assign(nextQueryParams, incomingFilters);

    this.filterKeys.forEach((filterKey) => {
      const isFilterIncomingAndMeaningful =
        incomingFilters.hasOwnProperty(filterKey) &&
        incomingFilters[filterKey] !== '' &&
        incomingFilters[filterKey] !== null &&
        incomingFilters[filterKey] !== undefined;

      if (
        !isFilterIncomingAndMeaningful &&
        nextQueryParams.hasOwnProperty(filterKey)
      ) {
        delete nextQueryParams[filterKey];
      }
    });

    Object.assign(nextQueryParams, incomingOther);

    nextQueryParams.page = nextQueryParams.page || 1;
    nextQueryParams.per_page = nextQueryParams.per_page || 20;
    const cleaned = this.cleanParams(nextQueryParams);

    this.queryParamsSubject.next(cleaned);
  }

  getAllProductsWithParams(): Observable<ProductsResponse> {
    const currentParams = this.queryParamsSubject.value;
    const httpParams = new HttpParams({ fromObject: currentParams as any });

    return this.http.get<any>(this.API_URL, { params: httpParams }).pipe(
      map((response) => {
        if (!response?.data?.products) {
          throw new Error('Estructura de respuesta no válida');
        }
        return response.data as ProductsResponse;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map((response) => {
        if (!response?.product) {
          throw new Error('Producto no encontrado');
        }
        return response.product;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<any>(this.API_URL, productData).pipe(
      map((response) => {
        if (!response?.data) {
          throw new Error('No se ha podido crear el producto');
        }
        return response.data;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(error?.message || 'Error al eliminar producto')
          )
        )
      );
  }

  updateProduct(id: string, updateData: Partial<Product>): Observable<Product> {
    return this.http.patch<any>(`${this.API_URL}/${id}`, updateData).pipe(
      map((response) => {
        if (!response?.data) {
          throw new Error('No se ha podido actualizar el producto');
        }
        return response.data;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }
}
