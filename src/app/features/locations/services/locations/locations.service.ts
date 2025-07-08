import { catchError, map, throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LocationApiResponse,
  LocationPayload,
  ClientLocation,
} from '../../models/locationsModel';

const API_URL = 'https://viticultura-backend.onrender.com/locations';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  constructor(private http: HttpClient) {}

  getClientLocations(clientId: string): Observable<ClientLocation[]> {
    return this.http
      .get<LocationApiResponse>(`${API_URL}?owner=${clientId}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          return throwError(() => new Error('Error al obtener ubicaciones'));
        })
      );
  }

  createLocation(payload: LocationPayload): Observable<ClientLocation> {
    return this.http.post<LocationApiResponse>(API_URL, payload).pipe(
      map((res) => res.data[0]),
      catchError((err) => {
        console.error('Error creating location:', err);
        return throwError(
          () => new Error(err?.error?.message || 'Error al crear ubicación')
        );
      })
    );
  }
}
