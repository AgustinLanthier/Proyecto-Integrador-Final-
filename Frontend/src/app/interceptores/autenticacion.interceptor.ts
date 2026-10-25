import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API } from '../configuracion/api';

export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = (JSON.parse(sessionStorage.getItem('sesion') ?? 'null') as { token?: string } | null)?.token;

  const peticion =
    token && req.url.startsWith(API)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401 && token && !req.url.endsWith('/auth/login')) {
        sessionStorage.removeItem('sesion');
        router.navigate(['/login']);
      }
      return throwError(() => e);
    })
  );
};