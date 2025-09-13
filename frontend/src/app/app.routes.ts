import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role-guard';
import { guestOnlyGuard } from './guards/guest-only.guard';
import { adminOnlyGuard } from './guards/admin-only.guard';

export const routes: Routes = [
  // Home
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },

  // Guest-only pages
  {
    path: 'login',
    title: 'Sign in',
    canMatch: [guestOnlyGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    title: 'Create account',
    canMatch: [guestOnlyGuard],
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
  },

  // Admin area
  {
    path: 'admin',
    title: 'Admin',
    canMatch: [adminOnlyGuard],          // Prevents loading if not admin
    canActivate: [authGuard, roleGuard], // Extra protection
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),

    // All child pages render inside dashboard <router-outlet>
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products', title: 'Admin • Products' },

      // Products
      {
        path: 'products',
        title: 'Admin • Products',
        loadComponent: () =>
          import('./pages/admin/product-list/product-list').then(m => m.ProductList),
      },
      {
        path: 'products/add',
        title: 'Admin • Add product',
        loadComponent: () =>
          import('./pages/admin/product-add/product-add').then(m => m.ProductAdd),
      },
      {
        path: 'products/:id/edit',
        title: 'Admin • Edit product',
        loadComponent: () =>
          import('./pages/admin/product-edit/product-edit').then(m => m.ProductEdit),
      },

      // Featured (Hero banners) — ✅ moved under /admin
      {
        path: 'featured',
        title: 'Admin • Banners',
        loadComponent: () =>
          import('./pages/admin/featured-list/featured-list').then(m => m.FeaturedList),
      },
      {
        path: 'featured/add',
        title: 'Admin • Add Banner',
        loadComponent: () =>
          import('./pages/admin/featured-add/featured-add').then(m => m.FeaturedAddSimple),
      },
      {
        path: 'featured/:id/edit',
        title: 'Admin • Edit Banner',
        loadComponent: () =>
          import('./pages/admin/featured-edit/featured-edit').then(m => m.FeaturedEdit),
      },

      // داخل children لـ /admin في src/app/app.routes.ts
{
  path: 'featured',
  title: 'Admin • Banners',
  loadComponent: () =>
    import('./pages/admin/featured-list/featured-list').then(m => m.FeaturedList),
},
{
  path: 'featured/add',
  title: 'Admin • Add Banners',
  loadComponent: () =>
    import('./pages/admin/featured-add/featured-add').then(m => m.FeaturedAddSimple), // ✅ الجديد
},
{
  path: 'featured/:id/edit',
  title: 'Admin • Edit Banner',
  loadComponent: () =>
    import('./pages/admin/featured-edit/featured-edit').then(m => m.FeaturedEdit),   // تبقى للتحرير الفردي
},

    ],
  },

  // Profile (any authenticated user)
  {
    path: 'profile',
    title: 'My Profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
  },

  // 404
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
  },
];
