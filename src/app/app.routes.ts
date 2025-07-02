import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/product/product.component';
import { NotFoundPageComponent } from './components/shared/not-found-page/not-found-page.component';
import { ProductsComponent } from './components/products/products.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ClientProfileComponent } from './components/clients/client-profile/client-profile.component';
import { AddNewClientComponent } from './components/clients/add-new-client/add-new-client.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'addNewProduct', component: AddNewProductComponent },
  { path: 'updateProduct/:id', component: UpdateProductComponent },

  { path: 'clients', component: ClientListComponent },
  { path: 'clients/:id', component: ClientProfileComponent },
  { path: 'addNewClient', component: AddNewClientComponent },
  { path: 'updateClient/:id', component: UpdateProductComponent },

  { path: '**', component: NotFoundPageComponent },
];
