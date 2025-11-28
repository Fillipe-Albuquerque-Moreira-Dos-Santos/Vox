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

// src/app/features/historico/historico.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensagemService } from '../../core/services/mensagem.service';
import { SpeechService } from '../../core/services/speech.service';
import { AuthService } from '../../core/services/auth.service';
import { Mensagem } from '../../core/models/mensagem.model';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📜 Histórico de Mensagens</h1>

        <div class="flex gap-2">
          <button
            (click)="carregarFavoritas()"
            [class.bg-yellow-500]="mostrandoFavoritas()"
            [class.bg-gray-300]="!mostrandoFavoritas()"
            class="px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity">
            ⭐ Favoritas
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      } @else if (mensagens().length === 0) {
        <div class="text-center py-20 text-gray-500">
          <p class="text-xl">Nenhuma mensagem encontrada</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (mensagem of mensagens(); track mensagem.id) {
            <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <p class="text-lg font-medium text-gray-800 mb-2">
                    {{ mensagem.textoCompleto }}
                  </p>
                  <div class="flex gap-4 text-sm text-gray-500">
                    <span>📅 {{ mensagem.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
                    @if (mensagem.contexto) {
                      <span>📂 {{ mensagem.contexto }}</span>
                    }
                    @if (mensagem.vezesReutilizada > 0) {
                      <span>🔄 {{ mensagem.vezesReutilizada }}x reutilizada</span>
                    }
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    (click)="toggleFavorita(mensagem)"
                    [class.text-yellow-500]="mensagem.favorita"
                    [class.text-gray-400]="!mensagem.favorita"
                    class="p-2 hover:scale-110 transition-transform">
                    ⭐
                  </button>

                  <button
                    (click)="falar(mensagem)"
                    class="p-2 text-green-600 hover:scale-110 transition-transform">
                    🔊
                  </button>

                  <button
                    (click)="reutilizar(mensagem)"
                    class="p-2 text-blue-600 hover:scale-110 transition-transform">
                    🔄
                  </button>
                </div>
              </div>

              <!-- Pictogramas -->
              @if (getPictogramas(mensagem).length > 0) {
                <div class="flex flex-wrap gap-2">
                  @for (pict of getPictogramas(mensagem); track pict.id) {
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {{ pict.label }}
                    </span>
                  }
                </div>
              }
            </div>
          }
        </div>

        @if (!mostrandoFavoritas() && hasMore()) {
          <div class="flex justify-center mt-6">
            <button
              (click)="carregarMais()"
              class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
              Carregar Mais
            </button>
          </div>
        }
      }
    </div>
  `
})
export class HistoricoComponent implements OnInit {
  mensagens = signal<Mensagem[]>([]);
  loading = signal(false);
  mostrandoFavoritas = signal(false);
  page = signal(0);
  hasMore = signal(true);

  constructor(
    private mensagemService: MensagemService,
    private speechService: SpeechService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.loading.set(true);
    this.mensagemService.listar(usuarioId, this.page(), 20).subscribe({
      next: (response) => {
        this.mensagens.set(response.content);
        this.hasMore.set(!response.last);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.loading.set(false);
      }
    });
  }

  carregarMais(): void {
    this.page.update(p => p + 1);
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.mensagemService.listar(usuarioId, this.page(), 20).subscribe({
      next: (response) => {
        this.mensagens.update(msgs => [...msgs, ...response.content]);
        this.hasMore.set(!response.last);
      },
      error: (err) => console.error('Erro ao carregar mais:', err)
    });
  }

  carregarFavoritas(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.mostrandoFavoritas.update(v => !v);

    if (this.mostrandoFavoritas()) {
      this.loading.set(true);
      this.mensagemService.listarFavoritas(usuarioId).subscribe({
        next: (mensagens) => {
          this.mensagens.set(mensagens);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar favoritas:', err);
          this.loading.set(false);
        }
      });
    } else {
      this.page.set(0);
      this.carregar();
    }
  }

  toggleFavorita(mensagem: Mensagem): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.mensagemService.toggleFavorita(mensagem.id, usuarioId).subscribe({
      next: (atualizada) => {
        this.mensagens.update(msgs =>
          msgs.map(m => m.id === atualizada.id ? atualizada : m)
        );
      },
      error: (err) => console.error('Erro ao atualizar favorita:', err)
    });
  }

  falar(mensagem: Mensagem): void {
    this.speechService.speak(mensagem.textoCompleto);
  }

  reutilizar(mensagem: Mensagem): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.mensagemService.reutilizar(mensagem.id, usuarioId).subscribe({
      next: () => {
        mensagem.vezesReutilizada++;
        // Aqui você poderia navegar para a tela de comunicação
        // e pré-carregar os pictogramas da mensagem
      },
      error: (err) => console.error('Erro ao reutilizar:', err)
    });
  }

  getPictogramas(mensagem: Mensagem): any[] {
    try {
      return JSON.parse(mensagem.conteudoJson);
    } catch {
      return [];
    }
  }
}
