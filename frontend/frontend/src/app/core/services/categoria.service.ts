import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Categoria, CategoriaComPictogramas } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endpoint = '/categorias';

  constructor(private api: ApiService) {}

  criar(categoria: Partial<Categoria>, usuarioId: number): Observable<Categoria> {
    return this.api.post<Categoria>(this.endpoint, categoria, usuarioId);
  }

  listarDisponiveis(usuarioId: number): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(this.endpoint, usuarioId);
  }

  buscarComPictogramas(categoriaId: number, usuarioId: number): Observable<CategoriaComPictogramas> {
    return this.api.get<CategoriaComPictogramas>(`${this.endpoint}/${categoriaId}`, usuarioId);
  }

  atualizar(categoriaId: number, categoria: Partial<Categoria>, usuarioId: number): Observable<Categoria> {
    return this.api.put<Categoria>(`${this.endpoint}/${categoriaId}`, categoria, usuarioId);
  }

  desativar(categoriaId: number, usuarioId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${categoriaId}`, usuarioId);
  }

  reordenar(categoriaIds: number[], usuarioId: number): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/reordenar`, categoriaIds, usuarioId);
  }
}
