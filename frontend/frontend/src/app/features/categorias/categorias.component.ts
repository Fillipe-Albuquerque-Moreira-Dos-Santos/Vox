// src/app/features/categorias/categorias.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../core/services/categoria.service';
import { PictogramaService } from '../../core/services/pictograma.service';
import { AuthService } from '../../core/services/auth.service';
import { Categoria } from '../../core/models/categoria.model';
import { Pictograma, TipoPictograma } from '../../core/models/pictograma.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📂 Gerenciar Categorias e Pictogramas</h1>

        <button
          (click)="abrirModalNovaCategoria()"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
          ➕ Nova Categoria
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      } @else {
        <div class="space-y-6">
          @for (categoria of categorias(); track categoria.id) {
            <div class="bg-white rounded-lg shadow-lg p-6">

              <!-- Cabeçalho da Categoria -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                    [ngClass]="categoria.cor">
                    {{ categoria.icone || '📁' }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-800">{{ categoria.nome }}</h2>
                    <p class="text-gray-600">{{ categoria.descricao }}</p>
                    @if (categoria.padrao) {
                      <span class="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        🏷️ Padrão do Sistema
                      </span>
                    }
                  </div>
                </div>

                <div class="flex gap-2">
                  @if (!categoria.padrao) {
                    <button
                      (click)="editarCategoria(categoria)"
                      class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg transition-colors">
                      ✏️ Editar
                    </button>
                    <button
                      (click)="desativarCategoria(categoria)"
                      class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg transition-colors">
                      🗑️ Remover
                    </button>
                  }
                  <button
                    (click)="abrirModalNovoPictograma(categoria)"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                    ➕ Pictograma
                  </button>
                </div>
              </div>

              <!-- Pictogramas da Categoria -->
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                @for (pictograma of getPictogramasCategoria(categoria.id); track pictograma.id) {
                  <div class="relative group">
                    <div
                      class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:shadow-lg"
                      [ngClass]="pictograma.cor">

                      @if (pictograma.tipo === 'EMOJI') {
                        <span class="text-3xl mb-1">{{ pictograma.icone }}</span>
                      } @else if (pictograma.tipo === 'ICONE') {
                        <span class="text-3xl mb-1">{{ pictograma.icone }}</span>
                      } @else if (pictograma.imagemUrl) {
                        <img [src]="pictograma.imagemUrl" [alt]="pictograma.label" class="w-12 h-12 object-cover rounded mb-1">
                      }

                      <span class="text-xs font-bold text-white text-center">{{ pictograma.label }}</span>

                      @if (!pictograma.padrao) {
                        <div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            (click)="editarPictograma(pictograma)"
                            class="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs">
                            ✏️
                          </button>
                          <button
                            (click)="desativarPictograma(pictograma)"
                            class="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs">
                            ✕
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Categoria -->
      @if (modalCategoriaAberto()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
              {{ categoriaEditando() ? '✏️ Editar Categoria' : '➕ Nova Categoria' }}
            </h2>

            <form (ngSubmit)="salvarCategoria()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  [(ngModel)]="categoriaForm.nome"
                  name="nome"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                  type="text"
                  [(ngModel)]="categoriaForm.descricao"
                  name="descricao"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ícone (emoji)</label>
                <input
                  type="text"
                  [(ngModel)]="categoriaForm.icone"
                  name="icone"
                  placeholder="📁"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                <select
                  [(ngModel)]="categoriaForm.cor"
                  name="cor"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="bg-red-500">Vermelho</option>
                  <option value="bg-blue-500">Azul</option>
                  <option value="bg-green-500">Verde</option>
                  <option value="bg-yellow-500">Amarelo</option>
                  <option value="bg-purple-500">Roxo</option>
                  <option value="bg-pink-500">Rosa</option>
                  <option value="bg-orange-500">Laranja</option>
                  <option value="bg-cyan-500">Ciano</option>
                  <option value="bg-gray-500">Cinza</option>
                </select>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  (click)="fecharModalCategoria()"
                  class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                  {{ categoriaEditando() ? 'Atualizar' : 'Criar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Modal Pictograma -->
      @if (modalPictogramaAberto()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
              {{ pictogramaEditando() ? '✏️ Editar Pictograma' : '➕ Novo Pictograma' }}
            </h2>

            <form (ngSubmit)="salvarPictograma()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <input
                  type="text"
                  [(ngModel)]="pictogramaForm.label"
                  name="label"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Labels Alternativos (separados por vírgula)</label>
                <input
                  type="text"
                  [(ngModel)]="pictogramaForm.labelAlternativo"
                  name="labelAlternativo"
                  placeholder="sinônimos, palavras relacionadas"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  [(ngModel)]="pictogramaForm.tipo"
                  name="tipo"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="EMOJI">Emoji</option>
                  <option value="ICONE">Ícone</option>
                  <option value="IMAGEM">Imagem URL</option>
                </select>
              </div>

              @if (pictogramaForm.tipo === 'EMOJI' || pictogramaForm.tipo === 'ICONE') {
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ícone/Emoji</label>
                  <input
                    type="text"
                    [(ngModel)]="pictogramaForm.icone"
                    name="icone"
                    placeholder="😊 ou nome do ícone"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
              }

              @if (pictogramaForm.tipo === 'IMAGEM') {
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    [(ngModel)]="pictogramaForm.imagemUrl"
                    name="imagemUrl"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
              }

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                <select
                  [(ngModel)]="pictogramaForm.cor"
                  name="cor"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="bg-red-400">Vermelho</option>
                  <option value="bg-blue-400">Azul</option>
                  <option value="bg-green-400">Verde</option>
                  <option value="bg-yellow-400">Amarelo</option>
                  <option value="bg-purple-400">Roxo</option>
                  <option value="bg-pink-400">Rosa</option>
                  <option value="bg-orange-400">Laranja</option>
                  <option value="bg-cyan-400">Ciano</option>
                </select>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  (click)="fecharModalPictograma()"
                  class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                  {{ pictogramaEditando() ? 'Atualizar' : 'Criar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  pictogramas = signal<Pictograma[]>([]);
  loading = signal(false);

  modalCategoriaAberto = signal(false);
  categoriaEditando = signal<Categoria | null>(null);
  categoriaForm: any = {};

  modalPictogramaAberto = signal(false);
  pictogramaEditando = signal<Pictograma | null>(null);
  categoriaSelecionada = signal<Categoria | null>(null);
  pictogramaForm: any = {};

  constructor(
    private categoriaService: CategoriaService,
    private pictogramaService: PictogramaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.loading.set(true);
    this.categoriaService.listarDisponiveis(usuarioId).subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregarPictogramas(usuarioId);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.loading.set(false);
      }
    });
  }

  carregarPictogramas(usuarioId: number): void {
    const promises = this.categorias().map(cat =>
      this.pictogramaService.listarPorCategoria(cat.id, usuarioId).toPromise()
    );

    Promise.all(promises).then(results => {
      const todosPictogramas = results.flat().filter(p => p !== undefined) as Pictograma[];
      this.pictogramas.set(todosPictogramas);
      this.loading.set(false);
    });
  }

  getPictogramasCategoria(categoriaId: number): Pictograma[] {
    return this.pictogramas().filter(p => p.categoriaId === categoriaId);
  }

  // Categoria
  abrirModalNovaCategoria(): void {
    this.categoriaEditando.set(null);
    this.categoriaForm = { nome: '', descricao: '', cor: 'bg-blue-500', icone: '📁' };
    this.modalCategoriaAberto.set(true);
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditando.set(categoria);
    this.categoriaForm = { ...categoria };
    this.modalCategoriaAberto.set(true);
  }

  fecharModalCategoria(): void {
    this.modalCategoriaAberto.set(false);
    this.categoriaEditando.set(null);
  }

  salvarCategoria(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    const dados = {
      ...this.categoriaForm,
      ativa: true,
      padrao: false,
      ordem: this.categorias().length
    };

    const categoriaId = this.categoriaEditando()?.id;
    const operacao = categoriaId
      ? this.categoriaService.atualizar(categoriaId, dados, usuarioId)
      : this.categoriaService.criar(dados, usuarioId);

    operacao.subscribe({
      next: () => {
        this.carregar();
        this.fecharModalCategoria();
      },
      error: (err) => console.error('Erro ao salvar categoria:', err)
    });
  }

  desativarCategoria(categoria: Categoria): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    if (confirm(`Deseja realmente remover a categoria "${categoria.nome}"?`)) {
      this.categoriaService.desativar(categoria.id, usuarioId).subscribe({
        next: () => this.carregar(),
        error: (err) => console.error('Erro ao desativar categoria:', err)
      });
    }
  }

  // Pictograma
  abrirModalNovoPictograma(categoria: Categoria): void {
    this.categoriaSelecionada.set(categoria);
    this.pictogramaEditando.set(null);
    this.pictogramaForm = {
      label: '',
      labelAlternativo: '',
      cor: 'bg-blue-400',
      tipo: 'EMOJI',
      icone: '',
      imagemUrl: '',
      ordem: this.getPictogramasCategoria(categoria.id).length
    };
    this.modalPictogramaAberto.set(true);
  }

  editarPictograma(pictograma: Pictograma): void {
    this.pictogramaEditando.set(pictograma);
    this.pictogramaForm = { ...pictograma };
    this.modalPictogramaAberto.set(true);
  }

  fecharModalPictograma(): void {
    this.modalPictogramaAberto.set(false);
    this.pictogramaEditando.set(null);
    this.categoriaSelecionada.set(null);
  }

  salvarPictograma(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    const categoria = this.categoriaSelecionada() || this.categorias().find(c =>
      c.id === this.pictogramaEditando()?.categoriaId
    );

    if (!categoria) return;

    const dados = {
      ...this.pictogramaForm,
      categoriaId: categoria.id
    };

    const pictogramaId = this.pictogramaEditando()?.id;
    const operacao = pictogramaId
      ? this.pictogramaService.atualizar(pictogramaId, dados, usuarioId)
      : this.pictogramaService.criar(dados, usuarioId);

    operacao.subscribe({
      next: () => {
        this.carregar();
        this.fecharModalPictograma();
      },
      error: (err) => console.error('Erro ao salvar pictograma:', err)
    });
  }

  desativarPictograma(pictograma: Pictograma): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    if (confirm(`Deseja realmente remover o pictograma "${pictograma.label}"?`)) {
      this.pictogramaService.desativar(pictograma.id, usuarioId).subscribe({
        next: () => this.carregar(),
        error: (err) => console.error('Erro ao desativar pictograma:', err)
      });
    }
  }
}
