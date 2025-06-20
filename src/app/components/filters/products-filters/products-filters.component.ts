import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './products-filters.component.html',
  styleUrl: './products-filters.component.scss',
})
export class ProductsFiltersComponent {
  @Output() filtersChange = new EventEmitter<any>();

  filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      code: [''],
      variety: [''],
      pie: [''],
      isAvailable: [''],
    });

    this.filtersForm.valueChanges.subscribe((value) => {
      this.filtersChange.emit(value);
    });
  }

  resetFilters(): void {
    this.filtersForm.reset({
      code: '',
      variety: '',
      pie: '',
      isAvailable: '',
    });
    this.filtersChange.emit(this.filtersForm.value);
  }

  clearField(field: string): void {
    this.filtersForm.get(field)?.setValue('');
    this.filtersChange.emit(this.filtersForm.value);
  }
}
