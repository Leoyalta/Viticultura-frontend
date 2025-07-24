import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/productsModel';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

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
  selector: 'app-update-product',
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
    MatDialogModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  productForm!: FormGroup;
  originalData!: Product;
  id = '';

  private snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.productsService.getProductById(this.id).subscribe({
      next: (product) => {
        this.originalData = product;
        this.productForm = this.fb.group({
          code: [
            product.code,
            [
              Validators.required,
              Validators.pattern(/^(\d{2,3})-(\d{2,3})-(\d{2,3})$/),
            ],
          ],
          variety: [product.variety, [Validators.required]],
          pie: [product.pie, [Validators.required]],
          clon: [product.clon, [Validators.required]],
          clonPie: [product.clonPie, [Validators.required]],
          total: [product.total, [Validators.required, Validators.min(1)]],
          reserved: [product.reserved ?? 0, Validators.min(0)],
          stock: [product.stock, Validators.min(0)],
          isAvailable: [product.isAvailable, [Validators.required]],
        });
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          err.message ||
          'Error al cargar los detalles del producto.';
        this.openSnackBar(`Error: ${errorMessage}`, 'Cerrar', 'error-snackbar');
        this.router.navigate(['/products']);
      },
    });
  }

  hasChanges(): boolean {
    if (!this.originalData || !this.productForm) return false;
    const formData = this.productForm.getRawValue();
    return Object.keys(formData).some((key) => {
      if (key === 'reserved' || key === 'total') {
        const formValue =
          formData[key] === null || formData[key] === undefined
            ? 0
            : Number(formData[key]);
        const originalValue =
          (this.originalData as any)[key] === null ||
          (this.originalData as any)[key] === undefined
            ? 0
            : Number((this.originalData as any)[key]);
        return formValue !== originalValue;
      }
      if (key === 'isAvailable') {
        return (
          String(formData[key]) !== String((this.originalData as any)[key])
        );
      }
      return formData[key] !== (this.originalData as any)[key];
    });
  }

  submitUpdate(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.openSnackBar(
        'Por favor, corrige los errores del formulario antes de guardar.',
        'Cerrar',
        'warn-snackbar'
      );
      return;
    }

    const productData = { ...this.productForm.getRawValue() };

    if (productData.stock === null || productData.stock === 0) {
      delete productData.stock;
    }

    this.productsService.updateProduct(this.id, productData).subscribe({
      next: () => {
        this.openSnackBar(
          'Producto actualizado exitosamente. ✨',
          'OK',
          'success-snackbar'
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          err.message ||
          'Error al actualizar el producto.';
        this.openSnackBar(`Error: ${errorMessage}`, 'Cerrar', 'error-snackbar');
      },
    });
  }

  openUpdateConfirm(): void {
    if (!this.hasChanges()) {
      this.openSnackBar(
        'No hay cambios para guardar.',
        'Cerrar',
        'info-snackbar'
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que quieres actualizar este producto?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.submitUpdate();
      }
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
