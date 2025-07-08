import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  private draw!: MapboxDraw;

  constructor(private http: HttpClient) {}

  initMap(
    container: HTMLElement,
    center: [number, number],
    zoom: number = 10,
    onLoadCallback?: () => void
  ): void {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
      accessToken: environment.MAPBOX_TOKEN,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      if (onLoadCallback) onLoadCallback();
    });
  }
  geocodeAddress(address: string): Observable<[number, number]> {
    const accessToken = environment.MAPBOX_TOKEN;
    const query = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (res?.features?.length) {
          const [lng, lat] = res.features[0].center;
          return [lat, lng] as [number, number];
        } else {
          throw new Error('Dirección no encontrada');
        }
      }),
      catchError((err) =>
        throwError(() => new Error('Error en la búsqueda de dirección'))
      )
    );
  }
  enableClickToSelect(callback: (coords: [number, number]) => void): void {
    if (!this.map) return;

    this.map.on('click', (event) => {
      const lngLat = event.lngLat;
      const coords: [number, number] = [lngLat.lng, lngLat.lat];

      this.clearMarkers();
      this.addMarker(coords);
      callback(coords);
    });
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

  enablePolygonDrawing(): void {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    this.map.addControl(this.draw);
  }

  drawPolygons(
    polygons: {
      coordinates: number[][][];
      properties: { name: string; owner?: string; phone?: string }; // Add owner and phone here
    }[]
  ): void {
    this.clearPolygonLayer();

    polygons.forEach((polygonData, index) => {
      const geojson: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: polygonData.coordinates,
        },
        properties: {
          name: polygonData.properties.name || `Parcela ${index + 1}`,
          owner: polygonData.properties.owner,
          phone: polygonData.properties.phone,
        },
      };

      const sourceId = `polygon-source-${index}`;
      const layerId = `polygon-layer-${index}`;
      const labelId = `polygon-label-${index}`;

      this.map.addSource(sourceId, {
        type: 'geojson',
        data: geojson,
      });

      this.map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.4,
          'fill-outline-color': '#000',
        },
      });

      this.map.addLayer({
        id: labelId,
        type: 'symbol',
        source: sourceId,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 14,
          'text-offset': [0, 0.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#111',
        },
      });

      this.map.on('click', layerId, (e) => {
        const props = e.features?.[0]?.properties || {};
        const html = `
        <strong>${props['name']}</strong><br />
        👤 ${props['owner'] || 'Sin nombre'}<br />
        📞 ${props['phone'] || '—'}
      `;

        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(this.map);
      });

      this.map.on('mouseenter', layerId, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', layerId, () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
  }
  fitMapToPolygons(polygons: number[][][][]): void {
    if (!this.map || polygons.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    polygons.forEach((polygon) => {
      polygon[0].forEach(([lng, lat]) => {
        bounds.extend([lng, lat]);
      });
    });

    this.map.fitBounds(bounds, {
      padding: 40,
      animate: true,
    });
  }

  clearPolygonLayer(): void {
    if (this.map.getLayer('polygon-layer')) {
      this.map.removeLayer('polygon-layer');
    }

    if (this.map.getSource('polygon')) {
      this.map.removeSource('polygon');
    }
  }
}
