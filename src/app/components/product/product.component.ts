import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/productsModel';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

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
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          console.log(data);
        },

        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    } else {
      this.errorMessage = 'ID de producto no proporcionado.';
    }
  }

  deleteProduct(): void {
    if (!this.product?._id) return;

    this.productsService.deleteProduct(this.product._id).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => (this.errorMessage = err.message),
    });
  }
  goToUpdateProduct(id: string) {
    console.log(id);

    this.router.navigate(['/updateProduct', id]);
  }
}
