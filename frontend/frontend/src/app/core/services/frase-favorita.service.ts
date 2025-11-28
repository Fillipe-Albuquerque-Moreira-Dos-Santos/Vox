import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FraseFavorita } from '../models/frase-favorita.model';

@Injectable({
  providedIn: 'root'
})
export class FraseFavoritaService {
  private endpoint = '/frases-favoritas';

  constructor(private api: ApiService) {}

  criar(frase: Partial<FraseFavorita>, usuarioId: number): Observable<FraseFavorita> {
    return this.api.post<FraseFavorita>(this.endpoint, frase, usuarioId);
  }

  listar(usuarioId: number): Observable<FraseFavorita[]> {
    return this.api.get<FraseFavorita[]>(this.endpoint, usuarioId);
  }

  listarMaisUsadas(usuarioId: number): Observable<FraseFavorita[]> {
    return this.api.get<FraseFavorita[]>(`${this.endpoint}/mais-usadas`, usuarioId);
  }

  atualizar(fraseId: number, frase: Partial<FraseFavorita>, usuarioId: number): Observable<FraseFavorita> {
    return this.api.put<FraseFavorita>(`${this.endpoint}/${fraseId}`, frase, usuarioId);
  }

  registrarUso(fraseId: number, usuarioId: number): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${fraseId}/usar`, {}, usuarioId);
  }

  desativar(fraseId: number, usuarioId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${fraseId}`, usuarioId);
  }

  reordenar(fraseIds: number[], usuarioId: number): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/reordenar`, fraseIds, usuarioId);
  }
}
