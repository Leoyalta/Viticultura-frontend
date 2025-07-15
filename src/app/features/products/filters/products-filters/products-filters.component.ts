// src/app/components/products-filters/products-filters.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button'; // For the reset button

@Component({
  selector: 'app-products-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './products-filters.component.html',
  styleUrl: './products-filters.component.scss',
})
export class ProductsFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<any>();

  filtersForm: FormGroup;

  varietyOptions = [
    'macabeo',
    'xarello',
    'garnacha',
    'parellada',
    'chardonnay',
    'verdejo',
    'tempranillo',
    'sauvignon',
  ];
  pieOptions = ['R-110', 'SO-4', '41-B', 'Ru-140', '333'];

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      code: [''],
      variety: [''],
      pie: [''],
      isAvailable: [null],
    });
  }

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe((value) => {
      this.emitCurrentFilters();
    });
  }

  private emitCurrentFilters(): void {
    const value = this.filtersForm.value;
    const cleanedFilters: any = {};

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const val = value[key];

        if (key === 'isAvailable') {
          if (val !== null && val !== undefined && val !== '') {
            cleanedFilters[key] = String(val);
          }
        } else if (val !== '' && val !== null && val !== undefined) {
          cleanedFilters[key] = val;
        }
      }
    }
    this.filtersChange.emit(cleanedFilters);
  }

  resetFilters(): void {
    this.filtersForm.reset(
      {
        code: '',
        variety: '',
        pie: '',
        isAvailable: null,
      },
      { emitEvent: false }
    );
    this.emitCurrentFilters();
  }

  clearField(field: string): void {
    if (this.filtersForm.get(field)) {
      let newValue: any = '';

      if (field === 'isAvailable') {
        newValue = null;
      }

      this.filtersForm.get(field)?.setValue(newValue, { emitEvent: false });
      this.emitCurrentFilters();
    }
  }
}
