// clients.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Client, ClientsResponse } from '../../models/clientsModel';
import { QueryParams } from '../../../../shared/models/queryParamsModel';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly API_URL = 'https://viticultura-backend.onrender.com/clients';

  constructor(private http: HttpClient) {}

  private queryParamsSubject = new BehaviorSubject<QueryParams>({
    page: 1,
    per_page: 20,
  });

  queryParams$ = this.queryParamsSubject.asObservable();

  private cleanParams(params: QueryParams): QueryParams {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
      )
    ) as QueryParams;
  }

  updateQueryParams(params: Partial<QueryParams>): void {
    const current = this.queryParamsSubject.value;
    const cleaned = this.cleanParams({ ...current, ...params });
    this.queryParamsSubject.next(cleaned);
  }

  getAllClientsWithParams(): Observable<ClientsResponse> {
    const currentParams = this.queryParamsSubject.value;
    const httpParams = new HttpParams({ fromObject: currentParams as any });

    return this.http.get<any>(this.API_URL, { params: httpParams }).pipe(
      map((response) => {
        if (!response?.data?.clients) {
          throw new Error('Respuesta no válida');
        }
        return response.data as ClientsResponse;
      }),
      catchError((error) =>
        throwError(() => new Error(error?.message || 'Error desconocido'))
      )
    );
  }
  getClientById(id: string): Observable<Client> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map((response) => {
        if (!response?.client) {
          throw new Error('Cliente no encontrado');
        }
        return response.client;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error?.message || 'Error desconocido')
        );
      })
    );
  }
}
