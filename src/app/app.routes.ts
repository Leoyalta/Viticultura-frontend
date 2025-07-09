import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';

import { ProductComponent } from './features/products/components/product/product.component';
import { NotFoundPageComponent } from './features/not-found-page/not-found-page.component';
import { ProductsListComponent } from './features/products/components/products-list/products-list.component';
import { AddNewProductComponent } from './features/products/components/add-new-product/add-new-product.component';
import { UpdateProductComponent } from './features/products/components/update-product/update-product.component';

import { ClientListComponent } from './features/clients/components/client-list/client-list.component';
import { ClientProfileComponent } from './features/clients/components/client-profile/client-profile.component';
import { AddNewClientComponent } from './features/clients/components/add-new-client/add-new-client.component';
import { UpdateClientProfileComponent } from './features/clients/components/update-client-profile/update-client-profile.component';

import { CreateClientLocationComponent } from './features/locations/components/create-client-location/create-client-location.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductsListComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'addNewProduct', component: AddNewProductComponent },
  { path: 'updateProduct/:id', component: UpdateProductComponent },

  { path: 'clients', component: ClientListComponent },
  { path: 'clients/:id', component: ClientProfileComponent },
  { path: 'addNewClient', component: AddNewClientComponent },
  { path: 'updateClient/:id', component: UpdateClientProfileComponent },

  {
    path: 'clients/:id/locations/new',
    component: CreateClientLocationComponent,
  },

  { path: '**', component: NotFoundPageComponent },
];
