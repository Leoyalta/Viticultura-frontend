import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  constructor() {}

  initMap(
    containerId: string,
    center: [number, number],
    zoom: number = 10
  ): void {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
      accessToken: environment.MAPBOX_TOKEN,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  }

  addMarker(coords: [number, number], popupText?: string): mapboxgl.Marker {
    const popup = popupText
      ? new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${popupText}</strong>`
        )
      : undefined;

    const marker = new mapboxgl.Marker()
      .setLngLat(coords)
      .setPopup(popup ?? undefined)
      .addTo(this.map);

    this.markers.push(marker);
    return marker;
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
