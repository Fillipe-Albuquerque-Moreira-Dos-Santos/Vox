import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraseFavoritaService } from '../../core/services/frase-favorita.service';
import { SpeechService } from '../../core/services/speech.service';
import { AuthService } from '../../core/services/auth.service';
import { FraseFavorita } from '../../core/models/frase-favorita.model';

@Component({
  selector: 'app-frases-favoritas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">⭐ Frases Favoritas</h1>

        <button
          (click)="abrirModalNova()"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
          ➕ Nova Frase
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      } @else if (frases().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-lg">
          <div class="text-6xl mb-4">📝</div>
          <p class="text-xl text-gray-600 mb-4">Nenhuma frase favorita ainda</p>
          <p class="text-gray-500">Crie frases prontas para usar rapidamente na comunicação</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (frase of frases(); track frase.id) {
            <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative group">

              <!-- Ações no hover -->
              <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  (click)="editar(frase)"
                  class="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg">
                  ✏️
                </button>
                <button
                  (click)="desativar(frase)"
                  class="p-2 bg-red-100 hover:bg-red-200 rounded-lg">
                  🗑️
                </button>
              </div>

              <!-- Conteúdo -->
              <h3 class="text-lg font-bold text-gray-800 mb-3 pr-16">
                {{ frase.titulo }}
              </h3>

              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ frase.textoCompleto }}
              </p>

              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>🔄 {{ frase.vezesUsada }}x usada</span>
              </div>

              <!-- Botões de ação -->
              <div class="flex gap-2">
                <button
                  (click)="falar(frase)"
                  class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                  🔊 Falar
                </button>
                <button
                  (click)="usar(frase)"
                  class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                  ✅ Usar
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Nova/Editar Frase -->
      @if (modalAberto()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
              {{ fraseEditando() ? '✏️ Editar Frase' : '➕ Nova Frase Favorita' }}
            </h2>

            <form (ngSubmit)="salvar()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  [(ngModel)]="fraseForm.titulo"
                  name="titulo"
                  required
                  placeholder="Ex: Bom dia!"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Texto Completo
                </label>
                <textarea
                  [(ngModel)]="fraseForm.textoCompleto"
                  name="textoCompleto"
                  required
                  rows="4"
                  placeholder="Digite o texto da frase..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  (click)="fecharModal()"
                  class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                  {{ fraseEditando() ? 'Atualizar' : 'Criar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class FrasesFavoritasComponent implements OnInit {
  frases = signal<FraseFavorita[]>([]);
  loading = signal(false);
  modalAberto = signal(false);
  fraseEditando = signal<FraseFavorita | null>(null);

  fraseForm = {
    titulo: '',
    textoCompleto: ''
  };

  constructor(
    private fraseFavoritaService: FraseFavoritaService,
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
    this.fraseFavoritaService.listar(usuarioId).subscribe({
      next: (frases) => {
        this.frases.set(frases.filter(f => f.ativa));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar frases:', err);
        this.loading.set(false);
      }
    });
  }

  abrirModalNova(): void {
    this.fraseEditando.set(null);
    this.fraseForm = { titulo: '', textoCompleto: '' };
    this.modalAberto.set(true);
  }

  editar(frase: FraseFavorita): void {
    this.fraseEditando.set(frase);
    this.fraseForm = {
      titulo: frase.titulo,
      textoCompleto: frase.textoCompleto
    };
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.fraseEditando.set(null);
    this.fraseForm = { titulo: '', textoCompleto: '' };
  }

  salvar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    const dados = {
      titulo: this.fraseForm.titulo,
      textoCompleto: this.fraseForm.textoCompleto,
      conteudoJson: JSON.stringify([{ texto: this.fraseForm.textoCompleto }]),
      ativa: true,
      ordem: this.frases().length,
      vezesUsada: 0
    };

    const fraseId = this.fraseEditando()?.id;

    const operacao = fraseId
      ? this.fraseFavoritaService.atualizar(fraseId, dados, usuarioId)
      : this.fraseFavoritaService.criar(dados, usuarioId);

    operacao.subscribe({
      next: () => {
        this.carregar();
        this.fecharModal();
      },
      error: (err) => console.error('Erro ao salvar frase:', err)
    });
  }

  falar(frase: FraseFavorita): void {
    this.speechService.speak(frase.textoCompleto);
  }

  usar(frase: FraseFavorita): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.fraseFavoritaService.registrarUso(frase.id, usuarioId).subscribe({
      next: () => {
        frase.vezesUsada++;
        this.falar(frase);
        // Aqui você pode adicionar lógica para copiar para área de transferência
        // ou enviar para a tela de comunicação
      },
      error: (err) => console.error('Erro ao registrar uso:', err)
    });
  }

  desativar(frase: FraseFavorita): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    if (confirm(`Deseja realmente remover a frase "${frase.titulo}"?`)) {
      this.fraseFavoritaService.desativar(frase.id, usuarioId).subscribe({
        next: () => this.carregar(),
        error: (err) => console.error('Erro ao desativar frase:', err)
      });
    }
  }
}
