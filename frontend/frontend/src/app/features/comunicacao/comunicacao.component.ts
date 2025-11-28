// src/app/features/comunicacao/comunicacao.component.ts
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
  styleUrls: ['./comunicacao.component.scss']
})
export class ComunicacaoComponent implements OnInit {
  // Signals
  categorias = signal<Categoria[]>([]);
  categoriaSelecionada = signal<Categoria | null>(null);
  pictogramas = signal<Pictograma[]>([]);
  pictogramasSelecionados = signal<PictogramaSelecionado[]>([]);
  pictogramasMaisUsados = signal<Pictograma[]>([]);
  configuracao = signal<ConfiguracaoUsuario | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed
  textoCompleto = computed(() => {
    return this.pictogramasSelecionados()
      .map(p => p.pictograma.label)
      .join(' ');
  });

  conteudoJson = computed(() => {
    return JSON.stringify(
      this.pictogramasSelecionados().map(p => ({
        id: p.pictograma.id,
        label: p.pictograma.label,
        timestamp: p.timestamp
      }))
    );
  });

  tamanhoPictograma = computed(() => {
    const tamanho = this.configuracao()?.tamanhoPictograma;
    switch (tamanho) {
      case TamanhoPictograma.PEQUENO:
        return 'w-20 h-20';
      case TamanhoPictograma.GRANDE:
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  });

  modoEscuro = computed(() => this.configuracao()?.modoEscuro || false);
  modoAltoContraste = computed(() => this.configuracao()?.modoAltoContraste || false);

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
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.configuracaoService.obter(usuarioId).subscribe({
      next: (config) => this.configuracao.set(config),
      error: (err) => console.error('Erro ao carregar configuração:', err)
    });
  }

  carregarCategorias(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.loading.set(true);
    this.categoriaService.listarDisponiveis(usuarioId).subscribe({
      next: (categorias) => {
        this.categorias.set(categorias.filter(c => c.ativa));
        if (categorias.length > 0) {
          this.selecionarCategoria(categorias[0]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar categorias');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  carregarPictogramasMaisUsados(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.pictogramaService.listarMaisUsados(usuarioId, 10).subscribe({
      next: (pictogramas) => this.pictogramasMaisUsados.set(pictogramas),
      error: (err) => console.error('Erro ao carregar mais usados:', err)
    });
  }

  selecionarCategoria(categoria: Categoria): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId) return;

    this.categoriaSelecionada.set(categoria);
    this.loading.set(true);

    this.pictogramaService.listarPorCategoria(categoria.id, usuarioId).subscribe({
      next: (pictogramas) => {
        this.pictogramas.set(pictogramas.filter(p => p.ativo));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar pictogramas');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  selecionarPictograma(pictograma: Pictograma): void {
    // Adicionar pictograma selecionado
    this.pictogramasSelecionados.update(selecionados => [
      ...selecionados,
      { pictograma, timestamp: Date.now() }
    ]);

    // Registrar uso
    this.pictogramaService.registrarUso(pictograma.id).subscribe();

    // Falar o texto se configurado
    const config = this.configuracao();
    if (config?.habilitarSom && config?.confirmarSelecao) {
      this.speechService.speak(pictograma.label);
    }
  }

  removerUltimoPictograma(): void {
    this.pictogramasSelecionados.update(selecionados =>
      selecionados.slice(0, -1)
    );
  }

  limparSelecao(): void {
    this.pictogramasSelecionados.set([]);
    this.speechService.stop();
  }

  falarMensagem(): void {
    const texto = this.textoCompleto();
    if (texto) {
      this.speechService.speak(texto);
    }
  }

  salvarMensagem(): void {
    const usuarioId = this.authService.usuarioId;
    if (!usuarioId || this.pictogramasSelecionados().length === 0) return;

    const mensagem = {
      conteudoJson: this.conteudoJson(),
      textoCompleto: this.textoCompleto(),
      contexto: this.categoriaSelecionada()?.nome,
      dispositivoOrigem: 'WEB'
    };

    this.mensagemService.salvar(mensagem, usuarioId).subscribe({
      next: () => {
        console.log('Mensagem salva com sucesso');
        // Limpar após salvar se configurado
        if (this.configuracao()?.salvarHistorico) {
          this.limparSelecao();
        }
      },
      error: (err) => console.error('Erro ao salvar mensagem:', err)
    });
  }
}
