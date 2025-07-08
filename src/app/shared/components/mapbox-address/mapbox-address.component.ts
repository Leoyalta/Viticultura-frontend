import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxService } from '../../services/mapbox/mapbox.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapbox-address',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './mapbox-address.component.html',
  styleUrl: './mapbox-address.component.scss',
})
export class MapboxAddressComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Input() initialAddress: string = '';

  address: string = '';

  constructor(private mapboxService: MapboxService) {}

  ngAfterViewInit(): void {
    this.mapboxService.initMap(
      this.mapContainer.nativeElement.id,
      [1.867, 41.82],
      8
    );

    this.mapboxService.enableClickToSelect(([lng, lat]) => {
      this.locationSelected.emit({ lat, lng });
    });
  }

  searchLocation(): void {
    if (!this.address) return;

    this.mapboxService.geocodeAddress(this.address).subscribe({
      next: ([lat, lng]) => {
        this.mapboxService.clearMarkers();
        this.mapboxService.addMarker([lng, lat], this.address);
        this.mapboxService.map.flyTo({ center: [lng, lat], zoom: 14 });
        this.locationSelected.emit({ lat, lng });
      },
      error: (err) => {
        console.error('Geocoding error:', err.message);
      },
    });
  }
}
