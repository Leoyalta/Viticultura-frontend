import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from './services/themes/theme.service';
import { TabNavigationComponent } from './components/tab-navigation/tab-navigation.component';

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
