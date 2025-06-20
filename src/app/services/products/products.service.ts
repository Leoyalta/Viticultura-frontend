import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  Product,
  ProductQueryParams,
  ProductsResponse,
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

  private cleanParams(params: ProductQueryParams): ProductQueryParams {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
      )
    ) as ProductQueryParams;
  }
  updateQueryParams(params: Partial<ProductQueryParams>): void {
    const current = this.queryParamsSubject.value;

    const cleaned = this.cleanParams({ ...current, ...params });

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
        console.error('Error al actualizar producto:', error.message);
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }
}
