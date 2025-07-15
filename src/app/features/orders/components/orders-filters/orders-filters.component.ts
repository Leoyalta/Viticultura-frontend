// src/app/components/orders-filters/orders-filters.component.ts
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

export const allowedOrderStatuses = [
  'pending',
  'processing',
  'scheduled',
  'completed',
  'cancelled',
];

@Component({
  selector: 'app-orders-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './orders-filters.component.html',
  styleUrl: './orders-filters.component.scss',
})
export class OrdersFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<any>();
  @Input() initialFilters: any = {};

  filtersForm: FormGroup;
  allowedStatuses = allowedOrderStatuses;

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      plantingRequested: [null],
      plantingDate: [null],
      status: [''],
    });
  }

  ngOnInit(): void {
    if (Object.keys(this.initialFilters).length > 0) {
      const patchValue: any = { ...this.initialFilters };
      if (
        patchValue.plantingDate &&
        typeof patchValue.plantingDate === 'string'
      ) {
        patchValue.plantingDate = new Date(
          patchValue.plantingDate + 'T00:00:00.000Z'
        );
      }
      this.filtersForm.patchValue(patchValue, { emitEvent: false });
    }

    this.filtersForm.valueChanges.subscribe((value) => {
      this.emitCurrentFilters();
    });
  }

  clearField(field: string): void {
    if (this.filtersForm.get(field)) {
      let newValue: any = '';
      if (field === 'plantingRequested' || field === 'plantingDate') {
        newValue = null;
      }
      this.filtersForm.get(field)?.setValue(newValue, { emitEvent: false });
      this.emitCurrentFilters();
    }
  }

  resetFilters(): void {
    this.filtersForm.reset(
      {
        plantingRequested: null,
        plantingDate: null,
        status: '',
      },
      { emitEvent: false }
    );
    this.emitCurrentFilters();
  }

  private emitCurrentFilters(): void {
    const value = this.filtersForm.value;
    const cleanedFilters: any = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const val = value[key];
        if (key === 'plantingDate' && val instanceof Date) {
          const year = val.getUTCFullYear();
          const month = (val.getUTCMonth() + 1).toString().padStart(2, '0');
          const day = val.getUTCDate().toString().padStart(2, '0');
          cleanedFilters[key] = `${year}-${month}-${day}`;
        } else if (val !== '' && val !== null && val !== undefined) {
          if (key === 'plantingRequested') {
            cleanedFilters[key] = String(val);
          } else {
            cleanedFilters[key] = val;
          }
        }
      }
    }
    this.filtersChange.emit(cleanedFilters);
  }
}
