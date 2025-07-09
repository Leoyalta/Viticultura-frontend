import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MapboxService } from '../../../../shared/services/mapbox/mapbox.service';
import { LocationsService } from '../../services/locations/locations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationPayload } from '../../models/locationsModel';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-client-location',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './create-client-location.component.html',
  styleUrl: './create-client-location.component.scss',
})
export class CreateClientLocationComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  form!: FormGroup;
  draw!: MapboxDraw;
  clientId!: string;

  constructor(
    private fb: FormBuilder,
    private mapbox: MapboxService,
    private locationsService: LocationsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.form = this.fb.group({
      locationName: ['', Validators.required],
    });

    this.mapbox.initMap(
      this.mapContainer.nativeElement,
      [1.5, 41.2],
      10,
      () => {
        this.mapbox.enablePolygonDrawing();
      }
    );
  }

  saveLocation(): void {
    const coords = this.mapbox.getDrawnPolygon();
    if (!coords) {
      this.snackBar.open('Debes dibujar una parcela primero', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const payload: LocationPayload = {
      locationName: this.form.value.locationName,
      owner: this.clientId,
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
    };

    this.locationsService.createLocation(payload).subscribe({
      next: (createdLocation) => {
        this.snackBar.open('Parcela guardada con éxito ✅', 'Cerrar', {
          duration: 3000,
        });
        this.form.reset();
        this.mapbox.disableDrawing();

        this.router.navigate(['/clients', this.clientId], {
          state: { newLocation: createdLocation.geometry.coordinates },
        });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Cerrar', { duration: 4000 });
      },
    });
  }

  ngOnDestroy(): void {
    this.mapbox.disableDrawing();
  }
  onStyleChange(styleUrl: string): void {
    this.mapbox.setMapStyle(styleUrl);
  }
  // onStyleChange(styleUrl: string): void {
  //   this.mapboxService.setMapStyle(styleUrl);
  // }
}
