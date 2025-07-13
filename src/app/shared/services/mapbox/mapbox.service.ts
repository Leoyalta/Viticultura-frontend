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
  polygonLayers: {
    id: string;
    sourceId: string;
    locationId: string;
  }[] = [];
  private draw!: MapboxDraw;
  polygonLayerId = '';

  constructor(private http: HttpClient) {}

  initMap(
    container: HTMLElement,
    center: [number, number],
    zoom: number = 10,
    onLoadCallback?: () => void
  ): void {
    if (this.map) {
      this.map.remove();
    }
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
  setMapStyle(styleUrl: string): void {
    if (this.map?.isStyleLoaded()) {
      this.map.setStyle(styleUrl);
    } else {
      this.map?.on('load', () => {
        this.map?.setStyle(styleUrl);
      });
    }
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
    if (!this.map) return;

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    this.map.addControl(this.draw);
  }

  getDrawnPolygon(): number[][][] | null {
    if (!this.draw) return null;

    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const geometry = data.features[0].geometry;
      if (geometry.type === 'Polygon') {
        return geometry.coordinates as number[][][];
      }
    }
    return null;
  }

  disableDrawing(): void {
    if (this.map && this.draw) {
      try {
        this.map.removeControl(this.draw);
      } catch (err) {
        console.warn('⚠️ Failed to remove drawing controls:', err);
      }
    }
    this.draw = undefined as any;
  }

  drawPolygons(
    polygons: {
      coordinates: number[][][];
      properties: { id: string; name: string; owner?: string; phone?: string };
    }[]
  ): void {
    this.clearPolygonLayer();
    this.polygonLayers = [];

    polygons.forEach((polygonData, index) => {
      const geojson: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: polygonData.coordinates,
        },
        properties: {
          id: polygonData.properties.id,
          name: polygonData.properties.name || `Parcela ${index + 1}`,
          owner: polygonData.properties.owner,
          phone: polygonData.properties.phone,
        },
      };

      const sourceId = `polygon-source-${index}`;
      const layerId = `polygon-layer-${index}`;
      const labelId = `polygon-label-${index}`;

      if (this.map.getLayer(labelId)) {
        this.map.removeLayer(labelId);
      }

      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }

      if (this.map.getSource(sourceId)) {
        this.map.removeSource(sourceId);
      }
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
        new mapboxgl.Popup({ className: 'mapbox-custom-popup' })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(this.map);
      });

      this.map.on('mouseenter', layerId, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', layerId, () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.polygonLayers.push({
        id: layerId,
        sourceId,
        locationId: polygonData.properties.id,
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

  setPolygonRightClickHandler(
    callback: (polygonId: string, screenPoint: mapboxgl.Point) => void
  ): void {
    this.map.on('contextmenu', (event) => {
      event.preventDefault();

      const features = this.map.queryRenderedFeatures(event.point);
      const polygonLayerIds = this.polygonLayers.map((l) => l.id);

      const polygonFeature = features.find(
        (f) => f.layer && polygonLayerIds.includes(f.layer.id)
      );

      const polygonId = polygonFeature?.properties?.['id'];
      if (polygonId) {
        callback(polygonId, event.point);
      }
    });

    this.map.on('click', () => {
      callback('', new mapboxgl.Point(0, 0));
    });
    let touchStartTime = 0;

    this.map.on('touchstart', () => {
      touchStartTime = Date.now();
    });

    this.map.on('touchend', (e) => {
      const duration = Date.now() - touchStartTime;

      if (duration > 500) {
        const point = e.point;
        const features = this.map.queryRenderedFeatures(point);

        const polygonLayerIds = this.polygonLayers.map((l) => l.id);
        const polygonFeature = features.find(
          (f) => f.layer && polygonLayerIds.includes(f.layer.id)
        );

        const polygonId = polygonFeature?.properties?.['id'];
        if (polygonId) {
          callback(polygonId, point);
        }
      }
    });
  }

  setClickHandler(
    callback: (polygonId: string, lngLat: mapboxgl.LngLat) => void
  ): void {
    for (const layer of this.polygonLayers) {
      if (!this.map.getLayer(layer.id)) continue;

      this.map.on('click', layer.id, (event) => {
        const features = this.map.queryRenderedFeatures(event.point, {
          layers: [layer.id],
        });

        const polygonId = features[0]?.properties?.['id'];
        if (polygonId) {
          callback(polygonId, event.lngLat);
        }
      });
    }
  }
}
