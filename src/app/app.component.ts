import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ThemeService } from './core/themes/services/themes/theme.service';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

import { ScreenService } from './core/layout/services/screen.service';
import { AuthService } from './core/auth/services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly isMobile = this.screenService.isMobile;
  readonly drawerMode = this.screenService.drawerMode;
  readonly currentUser = toSignal(this.authService.user$);

  navLinks = [
    { label: 'HOME', path: 'home', icon: 'home' },
    { label: 'PRODUCTS', path: 'products', icon: 'category' },
    { label: 'CLIENTS', path: 'clients', icon: 'people' },
    { label: 'PEDIDOS', path: 'orders', icon: 'receipt' },
  ];

  authLinksNotLoggedIn = [
    { label: 'Login', path: 'login', icon: 'login' },
    { label: 'Register', path: 'register', icon: 'person_add' },
  ];

  constructor() {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.openSnackBar('Logged out successfully!', 'OK', 'success-snackbar');
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.openSnackBar(
          `Logout failed: ${err.error}`,
          'Dismiss',
          'error-snackbar'
        );
      },
    });
  }

  private openSnackBar(
    message: string,
    action: string = 'Close',
    panelClass: string = 'default-snackbar'
  ): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    };
    this.snackBar.open(message, action, config);
  }
}
