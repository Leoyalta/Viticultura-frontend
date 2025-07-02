import { Component, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  productForm!: FormGroup;
  originalData!: Product;
  errorMessage = '';
  id = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
          isAvailable: [product.isAvailable, [Validators.required]],
        });
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  hasChanges(): boolean {
    if (!this.originalData || !this.productForm) return false;
    const formData = this.productForm.getRawValue();
    return Object.keys(formData).some(
      (key) => formData[key] !== (this.originalData as any)[key]
    );
  }

  submitUpdate(): void {
    this.productsService
      .updateProduct(this.id, this.productForm.getRawValue())
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => (this.errorMessage = err.message),
      });
  }

  openUpdateConfirm(): void {
    if (!this.hasChanges()) {
      this.errorMessage = 'Debes modificar al menos un campo.';
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
}
