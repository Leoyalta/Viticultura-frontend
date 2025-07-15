// src/app/orders/orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  Order,
  OrdersQueryParams,
  OrdersResponse,
} from '../models/ordersModel';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly API_URL = 'https://viticultura-backend.onrender.com/orders';

  constructor(private http: HttpClient) {}

  private queryParamsSubject = new BehaviorSubject<OrdersQueryParams>({
    page: 1,
    per_page: 20,
    sortOrder: 'desc',
    sortBy: 'createdAt',
  });

  queryParams$ = this.queryParamsSubject.asObservable();

  private filterKeys: (keyof OrdersQueryParams)[] = [
    'client',
    'product',
    'plantingRequested',
    'plantingDate',
    'status',
  ];

  private cleanParams(params: OrdersQueryParams): OrdersQueryParams {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
      )
    ) as OrdersQueryParams;
  }

  updateQueryParams(params: Partial<OrdersQueryParams>): void {
    let currentParams = { ...this.queryParamsSubject.value };

    const incomingFilters: Partial<OrdersQueryParams> = {};
    const incomingOther: Partial<OrdersQueryParams> = {};

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const queryKey = key as keyof OrdersQueryParams;
        const value = params[queryKey];

        if (this.filterKeys.includes(queryKey)) {
          (incomingFilters as any)[queryKey] = value;
        } else {
          (incomingOther as any)[queryKey] = value;
        }
      }
    }

    let nextQueryParams: OrdersQueryParams = {
      page: 1,
      per_page: currentParams.per_page || 20,
      sortBy: currentParams.sortBy || 'createdAt',
      sortOrder: currentParams.sortOrder || 'desc',
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
    nextQueryParams.sortBy = nextQueryParams.sortBy || 'createdAt';
    nextQueryParams.sortOrder = nextQueryParams.sortOrder || 'desc';

    const cleaned = this.cleanParams(nextQueryParams);

    this.queryParamsSubject.next(cleaned);
  }

  getAllOrdersWithParams(): Observable<OrdersResponse> {
    const currentParams = this.queryParamsSubject.value;
    const httpParams = new HttpParams({ fromObject: currentParams as any });

    return this.http.get<any>(this.API_URL, { params: httpParams }).pipe(
      map((response) => {
        if (!response?.data?.orders) {
          throw new Error('Respuesta de pedidos no válida');
        }
        return response.data as OrdersResponse;
      }),
      catchError((error) =>
        throwError(
          () => new Error(error?.message || 'Error al obtener pedidos')
        )
      )
    );
  }

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<any>(this.API_URL, orderData).pipe(
      map((response) => {
        if (!response?.data) {
          throw new Error(
            'No se pudo crear el pedido: estructura de respuesta inválida'
          );
        }
        console.log(response.data as Order);

        return response.data as Order;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error al crear pedido')
        );
      })
    );
  }
}
