import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sort-controls',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './sort-controls.component.html',
  styleUrls: ['./sort-controls.component.scss'],
})
export class SortControlsComponent implements OnInit {
  @Input() sortOptions: { value: string; label: string }[] = [];

  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>();

  sortForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sortForm = this.fb.group({
      sortBy: [this.sortOptions[0]?.value || ''],
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
