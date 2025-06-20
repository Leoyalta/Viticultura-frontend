import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/product/product.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { ProductsComponent } from './components/products/products.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'addNewProduct', component: AddNewProductComponent },
  { path: 'updateProduct/:id', component: UpdateProductComponent },

  { path: '**', component: NotFoundPageComponent },
];
