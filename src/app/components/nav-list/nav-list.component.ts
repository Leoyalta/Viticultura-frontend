import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth/auth.service';
// import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-nav-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.scss',
})
export class NavListComponent {
  // private authService = inject(AuthService);
  // private router = inject(Router);
  // user: User | null = null;
  // constructor() {
  //   this.authService.user$.subscribe((user) => (this.user = user));
  // }
  // async logout() {
  //   this.authService.logout().subscribe(() => {
  //     this.router.navigate(['/welcome']);
  //   });
  // }
}
