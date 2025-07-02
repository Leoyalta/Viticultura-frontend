import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort-controls',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sort-controls.component.html',
  styleUrls: ['./sort-controls.component.scss'],
})
export class SortControlsComponent {
  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>();

  sortForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sortForm = this.fb.group({
      sortBy: ['code'],
      sortOrder: ['asc'],
    });

    this.sortForm.valueChanges.subscribe((value) => {
      this.sortChange.emit({
        sortBy: value.sortBy,
        sortOrder: value.sortOrder as 'asc' | 'desc',
      });
    });
  }
}
