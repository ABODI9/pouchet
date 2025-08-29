import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role-guard';
import { guestOnlyGuard } from './guards/guest-only.guard';
import { adminOnlyGuard } from './guards/admin-only.guard';


export const routes: Routes = [
  // الصفحة الرئيسية
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },

  // صفحات الضيوف فقط
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

  // لوحة الإدارة (تُمنع حتى مرحلة المطابقة إن لم يكن Admin)
  {
    path: 'admin',
    title: 'Admin',
    canMatch: [adminOnlyGuard],             // يمنع التحميل إن لم يكن Admin
    canActivate: [authGuard, roleGuard],    // احتياط إضافي
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),

    // حماية جميع الصفحات الداخلية أيضًا
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products', title: 'Admin • Products' },

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
    ],
  },

  
  // صفحة البروفايل (أي مستخدم مسجّل)
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
