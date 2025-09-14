import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role-guard';
import { guestOnlyGuard } from './guards/guest-only.guard';
import { adminOnlyGuard } from './guards/admin-only.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },

  // صفحة تفاصيل المنتج — رابطها سيكون /product/123
  {
      path: 'product/:id',
      title: 'Product',
    // إن أنشأت barrel (index.ts) داخل مجلد product-detail استخدم السطر التالي:
    loadComponent: () =>    import('./pages/product-detail/product-detail').then(m => m.ProductDetailPage),

    // لو ما عندك index.ts استخدم هذا بدلًا من السطر السابق:
    // loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailPage),
  },

  {
    path: 'cart',
    title: 'Cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage),
  },

  // صفحات الضيوف
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

  // لوحة التحكم
  {
    path: 'admin',
    title: 'Admin',
    canMatch: [adminOnlyGuard],
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
        title: 'Admin • Products',
      },
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
    ],
  },

  // 404 — اجعلها دائمًا آخر شيء
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
  },
];
