import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ConfiguracaoUsuario } from '../models/configuracao.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {
  private endpoint = '/api/configuracoes';
  private configuracaoSubject = new BehaviorSubject<ConfiguracaoUsuario | null>(null);
  public configuracao$ = this.configuracaoSubject.asObservable();

  constructor(private api: ApiService) {}

  obter(usuarioId: number): Observable<ConfiguracaoUsuario> {
    return this.api.get<ConfiguracaoUsuario>(this.endpoint, usuarioId).pipe(
      tap(config => this.configuracaoSubject.next(config))
    );
  }

  atualizar(configuracao: Partial<ConfiguracaoUsuario>, usuarioId: number): Observable<ConfiguracaoUsuario> {
    return this.api.put<ConfiguracaoUsuario>(this.endpoint, configuracao, usuarioId).pipe(
      tap(config => this.configuracaoSubject.next(config))
    );
  }

  resetar(usuarioId: number): Observable<ConfiguracaoUsuario> {
    return this.api.post<ConfiguracaoUsuario>(`${this.endpoint}/resetar`, {}, usuarioId).pipe(
      tap(config => this.configuracaoSubject.next(config))
    );
  }

  getConfiguracao(): ConfiguracaoUsuario | null {
    return this.configuracaoSubject.value;
  }
}
