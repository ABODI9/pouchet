// src/app/guards/admin-only.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree, UrlSegment, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminOnlyGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): true | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const target = '/' + segments.map(s => s.path).join('/'); // e.g. /admin/products

  if (!auth.isAuthenticated) {
    const returnUrl = encodeURIComponent(target || '/admin');
    return router.parseUrl(`/login?returnUrl=${returnUrl}`);
  }
  if (auth.role === 'admin') return true;

  return router.parseUrl('/'); // مستخدم عادي
};
