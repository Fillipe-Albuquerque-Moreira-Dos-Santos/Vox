import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfiguracaoService } from '../../core/services/configuracao.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracaoUsuario } from '../../core/models/configuracao.model';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {

  configuracao = signal<ConfiguracaoUsuario | null>(null);
  loading = signal(false);
  mensagemSucesso = signal<string | null>(null);

  constructor(
    private configuracaoService: ConfiguracaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.loading.set(true);
    this.configuracaoService.obter(usuarioId).subscribe({
      next: (config) => {
        this.configuracao.set(config);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  salvar(): void {
    const usuarioId = this.authService.usuarioId;
    const config = this.configuracao();
    if (!usuarioId || !config) return;

    this.configuracaoService.atualizar(config, usuarioId).subscribe({
      next: () => this.mostrarSucesso('Configurações salvas com sucesso!'),
      error: (err) => console.error('Erro ao salvar:', err)
    });
  }

  resetar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    if (confirm('Deseja realmente restaurar todas as configurações?')) {
      this.configuracaoService.resetar(usuarioId).subscribe({
        next: (config) => {
          this.configuracao.set(config);
          this.mostrarSucesso('Configurações restauradas!');
        },
        error: (err) => console.error('Erro ao resetar:', err)
      });
    }
  }

  private mostrarSucesso(msg: string): void {
    this.mensagemSucesso.set(msg);
    setTimeout(() => this.mensagemSucesso.set(null), 3000);
  }
}
