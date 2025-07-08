import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clients-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './clients-filters.component.html',
  styleUrl: './clients-filters.component.scss',
})
export class ClientsFiltersComponent {
  @Output() filtersChange = new EventEmitter<any>();

  filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      name: [''],
      secondName: [''],
      phone: [''],
    });

    this.filtersForm.valueChanges.subscribe((value) => {
      this.filtersChange.emit(value);
    });
  }

  clearField(field: string): void {
    this.filtersForm.get(field)?.setValue('');
  }

  resetFilters(): void {
    this.filtersForm.reset({
      name: '',
      secondName: '',
      phone: '',
    });
    this.filtersChange.emit(this.filtersForm.value);
  }
}
