import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from './services/themes/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavListComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Viticultura-frontend';
  themeService = inject(ThemeService);
}
