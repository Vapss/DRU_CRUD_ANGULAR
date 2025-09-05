import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list.component';
import { ProductDetailComponent } from './pages/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', component: ProductsListComponent },
  { path: ':id', component: ProductDetailComponent },
];
