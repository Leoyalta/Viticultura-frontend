import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]],
      consent: [false, Validators.requiredTrue],
    },
    { validators: this.passwordsMatchValidator() }
  );

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const repeat = group.get('repeatPassword')?.value;
      return password && repeat && password !== repeat
        ? { passwordsMismatch: true }
        : null;
    };
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      this.openSnackBar(
        'Please fill out all required fields correctly.',
        'Dismiss',
        'warn-snackbar'
      );
      return;
    }

    const { email, password } = this.registerForm.getRawValue();

    this.authService.register(email, password).subscribe((result) => {
      if ('error' in result) {
        this.openSnackBar(
          `Registration failed: ${result.error}`,
          'Dismiss',
          'error-snackbar'
        );
      } else {
        this.openSnackBar(
          'Welcome! Your account has been created successfully. ✨',
          'OK',
          'success-snackbar'
        );
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
