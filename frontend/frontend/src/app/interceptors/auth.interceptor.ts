import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from '../core/services/auth.service';

/**
 * Interceptor para adicionar o token JWT em todas as requisições
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se não houver token, envia a requisição normal
  if (!token) {
    return next(req);
  }

  // Clone a requisição e adiciona o header Authorization
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};
