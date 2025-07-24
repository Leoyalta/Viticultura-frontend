import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent {
  productForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.nonNullable.group({
      code: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{2,3})-(\d{2,3})-(\d{2,3})$/),
        ],
      ],
      variety: ['', Validators.required],
      pie: ['', Validators.required],
      clon: ['', Validators.required],
      clonPie: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(1)]],
      reserved: [0, Validators.min(0)],
      stock: [Validators.required],
      isAvailable: [true, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.openSnackBar(
        'Por favor, rellena todos los campos obligatorios y corrige los errores.',
        'Cerrar',
        'warn-snackbar'
      );
      return;
    }

    this.productsService
      .createProduct(this.productForm.getRawValue())
      .subscribe({
        next: () => {
          this.openSnackBar(
            'Producto creado exitosamente. ✨',
            'OK',
            'success-snackbar'
          );
          this.router.navigate(['/products']);
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || err.message || 'Error al crear el producto.';
          this.openSnackBar(
            `Error: ${errorMessage}`,
            'Cerrar',
            'error-snackbar'
          );
        },
      });
  }
  private openSnackBar(
    message: string,
    action: string = 'Cerrar',
    panelClass: string = 'default-snackbar'
  ): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    };
    this.snackBar.open(message, action, config);
  }
}
