import { Component, signal, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ProductsFiltersComponent } from '../../../features/products/filters/products-filters/products-filters.component';

@Component({
  selector: 'app-filters-drawer',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, ProductsFiltersComponent],
  templateUrl: './filters-drawer.component.html',
  styleUrl: './filters-drawer.component.scss',
})
export class FiltersDrawerComponent {
  drawerMode = signal<'side' | 'over'>('side');
  isSmallScreen = signal(false);

  @Output() filtersChange = new EventEmitter<any>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall, // ~ < 600px
        Breakpoints.Small, // ~ 600px - 959px
        Breakpoints.Medium, // ~ 960px - 1279px
        Breakpoints.Large, // ~ 1280px - 1919px
        Breakpoints.XLarge, // ~ ≥ 1920px
      ])
      .subscribe((result) => {
        const breakpoints = result.breakpoints;

        const isSmallOrTablet =
          breakpoints[Breakpoints.XSmall] ||
          breakpoints[Breakpoints.Small] ||
          breakpoints[Breakpoints.Medium];

        this.isSmallScreen.set(isSmallOrTablet);
        this.drawerMode.set(isSmallOrTablet ? 'over' : 'side');
      });
  }

  handleFiltersChange(filters: any) {
    this.filtersChange.emit(filters);
  }
}
