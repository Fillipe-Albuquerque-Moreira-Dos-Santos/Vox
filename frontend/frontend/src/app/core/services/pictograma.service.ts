import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Pictograma, PictogramaCreate } from '../models/pictograma.model';

@Injectable({
  providedIn: 'root'
})
export class PictogramaService {
  private endpoint = '/pictogramas';

  constructor(private api: ApiService) {}

  criar(pictograma: PictogramaCreate, usuarioId: number): Observable<Pictograma> {
    return this.api.post<Pictograma>(this.endpoint, pictograma, usuarioId);
  }

  listarPorCategoria(categoriaId: number, usuarioId: number): Observable<Pictograma[]> {
    return this.api.get<Pictograma[]>(`${this.endpoint}/categoria/${categoriaId}`, usuarioId);
  }

  listarMaisUsados(usuarioId: number, limite: number = 10): Observable<Pictograma[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.api.get<Pictograma[]>(`${this.endpoint}/mais-usados`, usuarioId, params);
  }

  buscarPorTexto(termo: string): Observable<Pictograma[]> {
    const params = new HttpParams().set('termo', termo);
    return this.api.get<Pictograma[]>(`${this.endpoint}/buscar`, undefined, params);
  }

  atualizar(pictogramaId: number, pictograma: PictogramaCreate, usuarioId: number): Observable<Pictograma> {
    return this.api.put<Pictograma>(`${this.endpoint}/${pictogramaId}`, pictograma, usuarioId);
  }

  registrarUso(pictogramaId: number): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${pictogramaId}/usar`, {});
  }

  desativar(pictogramaId: number, usuarioId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${pictogramaId}`, usuarioId);
  }
}
