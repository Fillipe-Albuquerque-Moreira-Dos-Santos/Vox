// src/app/features/configuracoes/configuracoes.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracaoService } from '../../core/services/configuracao.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracaoUsuario, TamanhoPictograma } from '../../core/models/configuracao.model';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">⚙️ Configurações</h1>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      } @else if (configuracao()) {
        <div class="space-y-6">

          <!-- Aparência -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">🎨 Aparência</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho dos Pictogramas
                </label>
                <select
                  [(ngModel)]="configuracao()!.tamanhoPictograma"
                  (change)="salvar()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Modo Escuro</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.modoEscuro"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Alto Contraste</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.modoAltoContraste"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Áudio e Voz -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">🔊 Áudio e Voz</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Habilitar Som</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.habilitarSom"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>

              @if (configuracao()!.habilitarSom) {
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Velocidade da Voz: {{ configuracao()!.velocidadeVoz }}%
                  </label>
                  <input
                    type="range"
                    [(ngModel)]="configuracao()!.velocidadeVoz"
                    (change)="salvar()"
                    min="50"
                    max="200"
                    step="10"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Idioma da Voz
                  </label>
                  <select
                    [(ngModel)]="configuracao()!.idiomaVoz"
                    (change)="salvar()"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (EUA)</option>
                    <option value="es-ES">Espanhol</option>
                  </select>
                </div>
              }
            </div>
          </div>

          <!-- Acessibilidade -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">♿ Acessibilidade</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Modo Varredura</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.modoVarredura"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>

              @if (configuracao()!.modoVarredura) {
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tempo de Varredura: {{ configuracao()!.tempoVarredura }}ms
                  </label>
                  <input
                    type="range"
                    [(ngModel)]="configuracao()!.tempoVarredura"
                    (change)="salvar()"
                    min="500"
                    max="5000"
                    step="100"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                </div>
              }

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Confirmar Seleção com Som</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.confirmarSelecao"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Privacidade -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">🔒 Privacidade</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Salvar Histórico</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.salvarHistorico"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Permitir Relatórios</label>
                <input
                  type="checkbox"
                  [(ngModel)]="configuracao()!.permitirRelatorios"
                  (change)="salvar()"
                  class="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Botão de Reset -->
          <div class="flex justify-end gap-4">
            <button
              (click)="resetar()"
              class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
              🔄 Restaurar Padrões
            </button>
          </div>

          @if (mensagemSucesso()) {
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {{ mensagemSucesso() }}
            </div>
          }
        </div>
      }
    </div>
  `
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
      error: (err) => {
        console.error('Erro ao carregar configuração:', err);
        this.loading.set(false);
      }
    });
  }

  salvar(): void {
    const usuarioId = this.authService.usuarioId;
    const config = this.configuracao();
    if (!usuarioId || !config) return;

    this.configuracaoService.atualizar(config, usuarioId).subscribe({
      next: () => {
        this.mostrarSucesso('Configurações salvas com sucesso!');
      },
      error: (err) => console.error('Erro ao salvar:', err)
    });
  }

  resetar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    if (confirm('Deseja realmente restaurar as configurações padrão?')) {
      this.configuracaoService.resetar(usuarioId).subscribe({
        next: (config) => {
          this.configuracao.set(config);
          this.mostrarSucesso('Configurações restauradas!');
        },
        error: (err) => console.error('Erro ao resetar:', err)
      });
    }
  }

  private mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso.set(mensagem);
    setTimeout(() => this.mensagemSucesso.set(null), 3000);
  }
}

