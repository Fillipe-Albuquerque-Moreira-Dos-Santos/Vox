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
