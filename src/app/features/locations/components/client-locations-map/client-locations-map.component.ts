import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxService } from '../../../../shared/services/mapbox/mapbox.service';
import { LocationsService } from '../../services/locations/locations.service';

@Component({
  selector: 'app-client-locations-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-locations-map.component.html',
  styleUrl: './client-locations-map.component.scss',
})
export class ClientLocationsMapComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) clientId!: string;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  mapInitialized = false;

  constructor(
    private mapboxService: MapboxService,
    private locationsService: LocationsService
  ) {}

  ngAfterViewInit(): void {
    if (!this.mapContainer?.nativeElement) return;

    this.mapboxService.initMap(
      this.mapContainer.nativeElement,
      [1.5, 41.2],
      10,
      () => {
        this.mapInitialized = true;
        this.loadClientPolygons();
      }
    );
  }

  private loadClientPolygons(): void {
    if (!this.clientId) return;

    this.locationsService.getClientLocations(this.clientId).subscribe({
      next: (locations) => {
        this.mapboxService.clearPolygonLayer();

        const formatted = locations.map((loc) => ({
          coordinates: loc.geometry.coordinates,
          properties: {
            name: loc.locationName,
            owner: `${loc.owner?.name} ${loc.owner?.secondName}`,
            phone: loc.owner?.phone,
          },
        }));

        const allCoords = formatted.map((f) => f.coordinates);
        this.mapboxService.fitMapToPolygons(allCoords);

        this.mapboxService.drawPolygons(formatted);
      },
      error: (err) => {
        console.error('❌ Error loading locations:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.mapboxService.clearPolygonLayer();
  }
}
