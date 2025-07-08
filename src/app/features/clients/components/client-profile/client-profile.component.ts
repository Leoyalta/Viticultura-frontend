import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../services/clients/clients.service';
import { Client } from '../../models/clientsModel';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ClientLocationsMapComponent } from '../../../locations/components/client-locations-map/client-locations-map.component';
@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    SpinnerComponent,
    ClientLocationsMapComponent,
  ],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss',
})
export class ClientProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  client: Client | null = null;
  locations: Location[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no proporcionado';
      return;
    }

    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      },
    });
  }

  goToUpdateClient(): void {
    if (this.client?._id) {
      this.router.navigate(['/updateClient', this.client._id]);
    }
  }
  deleteClient(): void {
    if (!this.client?._id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este cliente?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.clientService.deleteClient(this.client!._id).subscribe({
          next: () => {
            this.snackBar.open('Cliente eliminado con éxito ✅', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/clients']);
          },
          error: (err) => {
            const msg =
              err?.error?.message || 'Error al eliminar el cliente ❌';
            this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
          },
        });
      }
    });
  }
}
// fetchLocations(ownerId: string) {
//   this.clientService.getClientLocations(ownerId).subscribe({
//     next: (locs) => {
//       this.locations = locs;
//       this.isLoading = false;
//     },
//     error: (err) => {
//       this.error = err.message;
//       this.isLoading = false;
//     },
//   });
// }
