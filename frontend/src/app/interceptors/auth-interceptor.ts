import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthCall =
    req.url.endsWith('/auth/login') || req.url.endsWith('/auth/register');

  const token = auth.token;
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // لا تعدّل رسالة الخطأ؛ فقط تعامل مع 401 في غير صفحة الدخول/التسجيل
      if (err.status === 401 && !isAuthCall) {
        auth.logout();
        // ممكن توجّه لصفحة الدخول مع returnUrl
        // router.navigate(['/login'], { queryParams: { returnUrl: router.url }});
      }
      // مهم: مرّر الخطأ كما هو للـcomponent
      return throwError(() => err);
    })
  );
};
