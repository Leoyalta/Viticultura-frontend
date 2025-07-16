import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

import { ThemeService } from './core/themes/services/themes/theme.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ScreenService } from './core/layout/services/screen.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Viticultura-frontend';
  themeService = inject(ThemeService);
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild(MatMenuTrigger) themeMenuTrigger!: MatMenuTrigger;

  private screenService = inject(ScreenService);

  readonly isMobile = this.screenService.isMobile;
  readonly drawerMode = this.screenService.drawerMode;

  navLinks = [
    { label: 'HOME', path: 'home', icon: 'home' },
    { label: 'PRODUCTS', path: 'products', icon: 'category' },
    { label: 'CLIENTS', path: 'clients', icon: 'people' },
    { label: 'PEDIDOS', path: 'orders', icon: 'receipt' },
  ];

  authLinks = [
    { label: 'Login', path: 'login', icon: 'login' },
    { label: 'Register', path: 'register', icon: 'person_add' },
  ];

  constructor() {}

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
