import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/login']);
      }

      if (error.status === 404) {
        console.error('Recurso não encontrado:', error.url);
      }

      if (error.status === 500) {
        console.error('Erro no servidor:', error.message);
      }

      return throwError(() => error);
    })
  );
};
