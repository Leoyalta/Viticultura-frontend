import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent {
  productForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productsService: ProductsService
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
      isAvailable: [true, Validators.required],
    });
  }

  errorMessage = '';

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.productsService
      .createProduct(this.productForm.getRawValue())
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => (this.errorMessage = err.message),
      });
  }
}
