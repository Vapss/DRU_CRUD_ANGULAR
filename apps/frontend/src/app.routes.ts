import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./app/features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./app/features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [() => import('./app/core/guards/auth.guard').then(m => m.authGuard)],
  },
  {
    path: 'products',
    loadChildren: () => import('./app/features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    canActivate: [() => import('./app/core/guards/auth.guard').then(m => m.authGuard)],
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];
