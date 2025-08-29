import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.model';

/** استخدمه مع data:{ roles: ['admin'] } في تعريف الروت */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = (route.data['roles'] as Role[] | undefined) ?? [];

  if (!auth.isAuthenticated) {
    return router.parseUrl('/login');
  }

  if (required.length === 0 || (auth.role && required.includes(auth.role))) {
    return true;
  }

  // لو الدور غير كافٍ
  return router.parseUrl('/');
};
