import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // نضيف الهيدر فقط لطلبات الـ API
  const isApi = req.url.startsWith('/api') || req.url.startsWith(environment.api);
  const isAuthCall = isApi && (req.url.endsWith('/auth/login') || req.url.endsWith('/auth/register'));

  const token = auth.token;
  const authReq = (isApi && token)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthCall) {
        auth.logout();
        // router.navigate(['/login'], { queryParams: { returnUrl: router.url }});
      }
      return throwError(() => err);
    })
  );
};
