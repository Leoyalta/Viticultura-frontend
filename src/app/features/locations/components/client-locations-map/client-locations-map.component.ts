import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxService } from '../../../../shared/services/mapbox/mapbox.service';
import { LocationsService } from '../../services/locations/locations.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

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
  router: any;

  selectedLocationId: string | null = null;
  contextMenuVisible = false;
  menuX = 0;
  menuY = 0;

  constructor(
    private mapboxService: MapboxService,
    private locationsService: LocationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

        this.mapboxService.setPolygonRightClickHandler((id, point) => {
          if (!id) {
            this.contextMenuVisible = false;
            return;
          }

          this.selectedLocationId = id;
          this.menuX = point.x;
          this.menuY = point.y;
          this.contextMenuVisible = true;
        });

        this.mapboxService.setClickHandler(() => {
          this.contextMenuVisible = false;
        });
      }
    );
  }

  private loadClientPolygons(): void {
    if (!this.clientId) return;

    this.locationsService.getClientLocations(this.clientId).subscribe({
      next: (locations) => {
        const formatted = locations.map((loc) => ({
          coordinates: loc.geometry.coordinates,
          properties: {
            id: loc._id,
            name: loc.locationName,
            owner: `${loc.owner?.name} ${loc.owner?.secondName}`,
            phone: loc.owner?.phone,
          },
        }));

        const allCoords = formatted.map((f) => f.coordinates);
        this.mapboxService.fitMapToPolygons(allCoords);
        this.mapboxService.clearPolygonLayer();
        this.mapboxService.drawPolygons(formatted);
      },
      error: (err) => {
        console.error('❌ Error loading locations:', err);
      },
    });
  }
  onDeleteSelectedLocation(): void {
    if (!this.selectedLocationId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar esta parcela?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.locationsService
          .deleteLocation(this.selectedLocationId!)
          .subscribe({
            next: () => {
              this.contextMenuVisible = false;
              this.selectedLocationId = null;
              this.loadClientPolygons();

              this.snackBar.open('Parcela eliminada con éxito ✅', 'Cerrar', {
                duration: 3000,
              });
            },
            error: (err) => {
              this.snackBar.open('Error al eliminar la parcela ❌', 'Cerrar', {
                duration: 4000,
              });
            },
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.mapboxService.clearPolygonLayer();
  }
}
