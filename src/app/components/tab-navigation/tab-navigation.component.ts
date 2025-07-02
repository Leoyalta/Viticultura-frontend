import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [MatTabsModule, RouterModule],
  templateUrl: './tab-navigation.component.html',
})
export class TabNavigationComponent {
  links = [
    { label: 'HOME', path: 'home' },
    { label: 'PRODUCTS', path: 'products' },
    { label: 'CLIENTS', path: 'clients' },
    { label: 'Login', path: 'login' },
    { label: 'Register', path: 'register' },
  ];
}
