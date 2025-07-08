import { TestBed } from '@angular/core/testing';

import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

// createLocation(payload: LocationPayload): Observable<ClientLocation> {
//   return this.http.post<LocationApiResponse>(API_URL, payload).pipe(
//     map((res) => res.data[0]),
//     catchError((err) => {
//       console.error('Error creating location:', err);
//       return throwError(
//         () => new Error(err?.error?.message || 'Error al crear ubicación')
//       );
//     })
//   );
// }
