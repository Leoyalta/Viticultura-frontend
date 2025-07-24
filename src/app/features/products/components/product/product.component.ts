import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/productsModel';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

// Custom Spinner Component Import
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    SpinnerComponent,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  isLoading: boolean = true;

  private snackBar = inject(MatSnackBar);

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.productsService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage =
            err.error?.message ||
            err.message ||
            'Error al cargar los detalles del producto.';
          this.openSnackBar(
            `Error: ${errorMessage}`,
            'Cerrar',
            'error-snackbar'
          );
          this.router.navigate(['/products']);
        },
      });
    } else {
      this.isLoading = false;
      this.openSnackBar(
        'ID de producto no proporcionado.',
        'Cerrar',
        'warn-snackbar'
      );
      this.router.navigate(['/products']);
    }
  }

  openDeleteConfirm(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que quieres eliminar este producto?' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteProduct();
      }
    });
  }

  deleteProduct(): void {
    if (!this.product?._id) {
      this.openSnackBar(
        'No se pudo eliminar el producto: ID no disponible.',
        'Cerrar',
        'error-snackbar'
      );
      return;
    }

    this.productsService.deleteProduct(this.product._id).subscribe({
      next: () => {
        this.openSnackBar(
          'Producto eliminado exitosamente.🗑️',
          'OK',
          'success-snackbar'
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message || err.message || 'Error al eliminar el producto.';
        this.openSnackBar(`Error: ${errorMessage}`, 'Cerrar', 'error-snackbar');
      },
    });
  }

  goToUpdateProduct(id: string): void {
    this.router.navigate(['/updateProduct', id]);
  }

  // New method to navigate back to products list
  goToProductsList(): void {
    this.router.navigate(['/products']);
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
