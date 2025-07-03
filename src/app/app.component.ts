import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListComponent } from './core/layout/nav-list/nav-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from './core/themes/services/themes/theme.service';
import { TabNavigationComponent } from './core/layout/tab-navigation/tab-navigation.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavListComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    TabNavigationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Viticultura-frontend';
  themeService = inject(ThemeService);
}
