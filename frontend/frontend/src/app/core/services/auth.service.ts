import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {environment} from '../../../environments/environment.prod';

// Interfaces
export interface LoginRequest {
  username: string;  // Na API é username mas recebe email
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  nome: string;
  email: string;
  telefone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:8080';
  private readonly TOKEN_KEY = 'vox_token';
  private readonly USER_KEY = 'vox_user';

  // Signals para estado reativo
  private currentUserSignal = signal<Usuario | null>(this.getUserFromStorage());
  private tokenSignal = signal<string | null>(this.getTokenFromStorage());

  // Computed signals
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());
  currentUserValue = computed(() => this.currentUserSignal());

  get usuarioId(): number | null {
    return this.currentUserSignal()?.id || null;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Login do usuário
   */
  login(email: string, senha: string): Observable<TokenResponse> {
    console.log('🌐 API_URL:', this.API_URL);  // ✅ ADICIONE
    console.log('🔗 URL completa:', `${this.API_URL}/auth/login`);
    const loginData: LoginRequest = {
      username: email,
      password: senha
    };

    // ✅ CORRETO: ${this.API_URL}/auth/login
    return this.http.post<TokenResponse>(`${this.API_URL}/auth/login`, loginData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.loadUserData().subscribe();
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Registrar novo usuário
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        catchError(error => {
          console.error('Erro no registro:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Carregar dados do usuário autenticado
   */
  loadUserData(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/auth/me`)
      .pipe(
        tap(usuario => {
          this.setUser(usuario);
        }),
        catchError(error => {
          console.error('Erro ao carregar dados do usuário:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obter token atual
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Salvar token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  /**
   * Salvar dados do usuário
   */
  private setUser(usuario: Usuario): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.currentUserSignal.set(usuario);
  }

  /**
   * Recuperar token do localStorage
   */
  private getTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Recuperar usuário do localStorage
   */
  private getUserFromStorage(): Usuario | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Verificar se o token é válido (não expirado)
   * Implementar lógica de validação JWT se necessário
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // TODO: Implementar validação de expiração do token JWT
    // Decodificar token e verificar exp

    return true;
  }
}
