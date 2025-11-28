import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Mensagem, MensagemCreate, Estatisticas } from '../models/mensagem.model';
import { PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private endpoint = '/mensagens';

  constructor(private api: ApiService) {}

  salvar(mensagem: MensagemCreate, usuarioId: number): Observable<Mensagem> {
    return this.api.post<Mensagem>(this.endpoint, mensagem, usuarioId);
  }

  listar(usuarioId: number, page: number = 0, size: number = 20): Observable<PageResponse<Mensagem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.api.get<PageResponse<Mensagem>>(this.endpoint, usuarioId, params);
  }

  listarFavoritas(usuarioId: number): Observable<Mensagem[]> {
    return this.api.get<Mensagem[]>(`${this.endpoint}/favoritas`, usuarioId);
  }

  listarPorPeriodo(usuarioId: number, inicio: string, fim: string): Observable<Mensagem[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);
    return this.api.get<Mensagem[]>(`${this.endpoint}/periodo`, usuarioId, params);
  }

  toggleFavorita(mensagemId: number, usuarioId: number): Observable<Mensagem> {
    return this.api.put<Mensagem>(`${this.endpoint}/${mensagemId}/favorita`, {}, usuarioId);
  }

  reutilizar(mensagemId: number, usuarioId: number): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${mensagemId}/reutilizar`, {}, usuarioId);
  }

  obterEstatisticas(usuarioId: number, inicio: string, fim: string): Observable<Estatisticas> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);
    return this.api.get<Estatisticas>(`${this.endpoint}/estatisticas`, usuarioId, params);
  }
}
