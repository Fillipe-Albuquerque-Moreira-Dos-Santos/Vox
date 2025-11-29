import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../core/services/categoria.service';
import { PictogramaService } from '../../core/services/pictograma.service';
import { MensagemService } from '../../core/services/mensagem.service';
import { SpeechService } from '../../core/services/speech.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracaoService } from '../../core/services/configuracao.service';
import { Categoria } from '../../core/models/categoria.model';
import { Pictograma } from '../../core/models/pictograma.model';
import { ConfiguracaoUsuario, TamanhoPictograma } from '../../core/models/configuracao.model';

interface PictogramaSelecionado {
  pictograma: Pictograma;
  timestamp: number;
}

@Component({
  selector: 'app-comunicacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comunicacao.component.html',
  styles: []
})
export class ComunicacaoComponent implements OnInit {

  categorias = signal<Categoria[]>([]);
  categoriaSelecionada = signal<Categoria | null>(null);
  pictogramas = signal<Pictograma[]>([]);
  pictogramasSelecionados = signal<PictogramaSelecionado[]>([]);
  pictogramasMaisUsados = signal<Pictograma[]>([]);
  configuracao = signal<ConfiguracaoUsuario | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // Construção do texto
  textoCompleto = computed(() =>
    this.pictogramasSelecionados().map(p => p.pictograma.label).join(' ')
  );

  conteudoJson = computed(() =>
    JSON.stringify(
      this.pictogramasSelecionados().map(p => ({
        id: p.pictograma.id,
        label: p.pictograma.label,
        timestamp: p.timestamp
      }))
    )
  );

  modoEscuro = computed(() => this.configuracao()?.modoEscuro ?? false);
  modoAltoContraste = computed(() => this.configuracao()?.modoAltoContraste ?? false);

  constructor(
    private categoriaService: CategoriaService,
    private pictogramaService: PictogramaService,
    private mensagemService: MensagemService,
    private speechService: SpeechService,
    private authService: AuthService,
    private configuracaoService: ConfiguracaoService
  ) {}

  ngOnInit(): void {
    this.carregarConfiguracao();
    this.carregarCategorias();
    this.carregarPictogramasMaisUsados();
  }

  carregarConfiguracao(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.configuracaoService.obter(userId).subscribe({
      next: config => this.configuracao.set(config),
      error: err => console.error('Erro ao carregar configuração', err)
    });
  }

  carregarCategorias(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.loading.set(true);

    this.categoriaService.listarDisponiveis(userId).subscribe({
      next: categorias => {
        const ativas = categorias.filter(c => c.ativa);
        this.categorias.set(ativas);

        if (ativas.length > 0) this.selecionarCategoria(ativas[0]);

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar categorias');
        this.loading.set(false);
      }
    });
  }

  carregarPictogramasMaisUsados(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.pictogramaService.listarMaisUsados(userId, 10).subscribe({
      next: lista => this.pictogramasMaisUsados.set(lista),
      error: err => console.error('Erro ao carregar mais usados', err)
    });
  }

  selecionarCategoria(categoria: Categoria): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.categoriaSelecionada.set(categoria);
    this.loading.set(true);

    this.pictogramaService.listarPorCategoria(categoria.id, userId).subscribe({
      next: lista => {
        this.pictogramas.set(lista.filter(p => p.ativo));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar pictogramas');
        this.loading.set(false);
      }
    });
  }

  selecionarPictograma(p: Pictograma): void {
    this.pictogramasSelecionados.update(lista => [
      ...lista,
      { pictograma: p, timestamp: Date.now() }
    ]);

    this.pictogramaService.registrarUso(p.id).subscribe();

    const cfg = this.configuracao();
    if (cfg?.habilitarSom && cfg?.confirmarSelecao) {
      this.speechService.speak(p.label);
    }
  }

  removerUltimoPictograma(): void {
    this.pictogramasSelecionados.update(lista => lista.slice(0, -1));
  }

  limparSelecao(): void {
    this.pictogramasSelecionados.set([]);
    this.speechService.stop();
  }

  falarMensagem(): void {
    const txt = this.textoCompleto();
    if (txt.length > 0) {
      this.speechService.speak(txt);
    }
  }

  salvarMensagem(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    const lista = this.pictogramasSelecionados();
    if (lista.length === 0) return;

    const mensagem = {
      conteudoJson: this.conteudoJson(),
      textoCompleto: this.textoCompleto(),
      contexto: this.categoriaSelecionada()?.nome,
      dispositivoOrigem: 'WEB'
    };

    this.mensagemService.salvar(mensagem, userId).subscribe({
      next: () => {
        if (this.configuracao()?.salvarHistorico) this.limparSelecao();
      },
      error: err => console.error('Erro ao salvar mensagem', err)
    });
  }
}
