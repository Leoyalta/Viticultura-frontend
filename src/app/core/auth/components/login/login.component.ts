import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.openSnackBar(
        'Please fill out all required fields correctly.',
        'Dismiss',
        'warn-snackbar'
      );
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe((result) => {
      if ('error' in result) {
        this.openSnackBar(
          `Login failed: ${result.error}`,
          'Dismiss',
          'error-snackbar'
        );
      } else {
        this.openSnackBar('Welcome back!', 'OK', 'success-snackbar');
        this.router.navigateByUrl('/home');
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe((result) => {
      if ('error' in result) {
        this.openSnackBar(
          `Google login failed: ${result.error}`,
          'Dismiss',
          'error-snackbar'
        );
      } else {
        this.openSnackBar('Welcome with Google!', 'OK', 'success-snackbar');
        this.router.navigateByUrl('/home');
      }
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
