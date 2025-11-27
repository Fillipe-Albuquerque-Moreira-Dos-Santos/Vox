// 📁 src/app/core/services/auth.ts
// SUBSTITUIR O CONTEÚDO EXISTENTE

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginDTO, RegisterDTO, TokenDTO, Usuario } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'auth_token';

  currentUser = signal<Usuario | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthentication();
  }

  register(data: RegisterDTO): Observable<TokenDTO> {
    console.log('📤 Enviando registro:', data);
    return this.http.post<TokenDTO>(`${this.API_URL}/auth/register`, data).pipe(
      tap(response => {
        console.log('✅ Registro bem-sucedido:', response);
        this.handleAuthSuccess(response);
      })
    );
  }

  login(data: LoginDTO): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.API_URL}/auth/login`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getMe(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/auth/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthSuccess(response: TokenDTO): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.getMe().subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.logout()
    });
  }

  private checkAuthentication(): void {
    const token = this.getToken();
    if (token) {
      this.getMe().subscribe({
        error: () => this.logout()
      });
    }
  }
}
