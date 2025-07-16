import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { ProductsListComponent } from './features/products/components/products-list/products-list.component';
import { ProductComponent } from './features/products/components/product/product.component';
import { AddNewProductComponent } from './features/products/components/add-new-product/add-new-product.component';
import { UpdateProductComponent } from './features/products/components/update-product/update-product.component';
import { ClientListComponent } from './features/clients/components/client-list/client-list.component';
import { ClientProfileComponent } from './features/clients/components/client-profile/client-profile.component';
import { AddNewClientComponent } from './features/clients/components/add-new-client/add-new-client.component';
import { UpdateClientProfileComponent } from './features/clients/components/update-client-profile/update-client-profile.component';
import { CreateClientLocationComponent } from './features/locations/components/create-client-location/create-client-location.component';
import { OrderListComponent } from './features/orders/components/order-list/order-list.component';
import { OrderDetailComponent } from './features/orders/components/order-detail/order-detail.component';
import { CreateOrderComponent } from './features/orders/components/create-order/create-order.component';
import { NotFoundPageComponent } from './features/not-found-page/not-found-page.component';

import { AuthGuard } from './core/auth/guards/authGuard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'products',
    component: ProductsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addNewProduct',
    component: AddNewProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateProduct/:id',
    component: UpdateProductComponent,
    canActivate: [AuthGuard],
  },

  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
  {
    path: 'clients/:id',
    component: ClientProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addNewClient',
    component: AddNewClientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateClient/:id',
    component: UpdateClientProfileComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'clients/:id/locations/new',
    component: CreateClientLocationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard] },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addNewOrder',
    component: CreateOrderComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: NotFoundPageComponent },
];
