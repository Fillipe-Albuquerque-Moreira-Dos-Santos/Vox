import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(usuarioId?: number): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (usuarioId) {
      headers = headers.set('Usuario-Id', usuarioId.toString());
    }

    return headers;
  }

  get<T>(endpoint: string, usuarioId?: number, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(usuarioId),
      params
    });
  }

  post<T>(endpoint: string, body: any, usuarioId?: number): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(usuarioId)
    });
  }

  put<T>(endpoint: string, body: any, usuarioId?: number): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(usuarioId)
    });
  }

  delete<T>(endpoint: string, usuarioId?: number): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(usuarioId)
    });
  }
}
