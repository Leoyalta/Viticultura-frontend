import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../services/clients/clients.service';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapboxAddressComponent } from '../../../../shared/components/mapbox-address/mapbox-address.component';

@Component({
  selector: 'app-add-new-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MapboxAddressComponent,
    MatSnackBarModule,
  ],
  templateUrl: './add-new-client.component.html',
  styleUrl: './add-new-client.component.scss',
})
export class AddNewClientComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      secondName: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+34\s\d{3}\s\d{3}\s\d{3}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        province: ['', Validators.required],
        country: ['España', Validators.required],
      }),
      location: this.fb.group({
        lat: [null],
        lng: [null],
      }),
    });
  }

  submitForm(): void {
    if (this.clientForm.valid && this.clientForm.get('location')?.valid) {
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
      delete payload.location;

      this.clientsService.createClient(payload).subscribe({
        next: () => {
          this.snackBar.open('Cliente creado con éxito ✅', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          const errorMsg =
            err?.error?.message ||
            'Error al crear el cliente ❌ (sin detalles)';
          this.snackBar.open(errorMsg, 'Cerrar', {
            duration: 4000,
          });
        },
      });
    } else {
      this.clientForm.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa todos los campos obligatorios',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    }
  }
}
