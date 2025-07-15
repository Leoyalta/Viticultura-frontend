import { Component, Output, EventEmitter } from '@angular/core';
import { ScreenService } from '../../../core/layout/services/screen.service';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filters-drawer',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './filters-drawer.component.html',
  styleUrl: './filters-drawer.component.scss',
})
export class FiltersDrawerComponent {
  @Output() filtersChange = new EventEmitter<any>();

  constructor(public screenService: ScreenService) {}

  handleFiltersChange(filters: any) {
    this.filtersChange.emit(filters);
  }
}
