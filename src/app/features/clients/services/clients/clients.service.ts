import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  Client,
  ClientsResponse,
  ClientsQueryParams,
} from '../../models/clientsModel';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly API_URL = 'https://viticultura-backend.onrender.com/clients';

  constructor(private http: HttpClient) {}

  private queryParamsSubject = new BehaviorSubject<ClientsQueryParams>({
    page: 1,
    per_page: 20,
  });

  queryParams$ = this.queryParamsSubject.asObservable();

  private cleanParams(params: ClientsQueryParams): ClientsQueryParams {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
      )
    ) as ClientsQueryParams;
  }

  updateQueryParams(params: Partial<ClientsQueryParams>): void {
    const current = this.queryParamsSubject.value;
    const cleaned = this.cleanParams({ ...current, ...params });
    this.queryParamsSubject.next(cleaned);
  }

  getAllClientsWithParams(): Observable<{
    clients: Client[];
    totalClients: number;
    per_page: number;
    page: number;
  }> {
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
  createClient(clientData: any): Observable<any> {
    return this.http
      .post<any>(this.API_URL, clientData)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(error?.message || 'No se pudo crear el cliente')
          )
        )
      );
  }
  updateClient(id: string, payload: any): Observable<Client> {
    return this.http
      .put<{ client: Client }>(`${this.API_URL}/${id}`, payload)
      .pipe(
        map((res) => res.client),
        catchError((error) =>
          throwError(
            () =>
              new Error(
                error?.error?.message || 'Error al actualizar el cliente'
              )
          )
        )
      );
  }
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
