import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../services/clients/clients.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MapboxAddressComponent } from '../../../../shared/components/mapbox-address/mapbox-address.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-update-client-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MapboxAddressComponent,
    MatDialogModule,
  ],
  templateUrl: './update-client-profile.component.html',
  styleUrl: './update-client-profile.component.scss',
})
export class UpdateClientProfileComponent implements OnInit {
  clientForm!: FormGroup;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private clientsService: ClientsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (!this.clientId) {
      this.snackBar.open('ID del cliente no proporcionado', 'Cerrar', {
        duration: 3000,
      });
      this.router.navigate(['/clients']);
      return;
    }

    this.clientForm = this.fb.group({
      name: [''],
      secondName: [''],
      phone: ['', Validators.pattern(/^\+34\s\d{3}\s\d{3}\s\d{3}$/)],
      email: ['', Validators.email],
      address: this.fb.group({
        street: [''],
        city: [''],
        postalCode: [''],
        province: [''],
        country: ['España'],
      }),
      location: this.fb.group({
        lat: [null],
        lng: [null],
      }),
    });

    this.clientsService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.clientForm.patchValue({
          name: client.name,
          secondName: client.secondName,
          phone: client.phone,
          email: client.email,
          address: client.address,
          location: {
            lat: client.address?.location?.coordinates[1],
            lng: client.address?.location?.coordinates[0],
          },
        });
      },
      error: () => {
        this.snackBar.open('Error al cargar los datos del cliente', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/clients']);
      },
    });
  }

  submitForm(): void {
    if (this.clientForm.dirty && this.clientId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar cambios',
          message: '¿Estás seguro de que deseas guardar los cambios?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.proceedToSubmit();
        }
      });
    } else {
      this.snackBar.open(
        'No hay cambios para guardar o el formulario no es válido',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  private proceedToSubmit(): void {
    const formData = this.clientForm.value;

    const payload = {
      ...formData,
      address: {
        ...formData.address,
        location: {
          type: 'Point',
          coordinates: [formData.location.lng, formData.location.lat],
        },
      },
    };

    delete (payload as any).location;

    this.clientsService.updateClient(this.clientId!, payload).subscribe({
      next: () => {
        this.snackBar.open('Cliente actualizado ✅', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Error al actualizar el cliente ❌';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}
