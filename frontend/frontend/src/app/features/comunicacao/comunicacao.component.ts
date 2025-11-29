import { Component, OnInit, OnDestroy, HostListener, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Services
import { CategoriaService } from '../../core/services/categoria.service';
import { PictogramaService } from '../../core/services/pictograma.service';
import { MensagemService } from '../../core/services/mensagem.service';
import { SpeechService } from '../../core/services/speech.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracaoService } from '../../core/services/configuracao.service';

// Models
import { Categoria } from '../../core/models/categoria.model';
import { Pictograma } from '../../core/models/pictograma.model';
import { ConfiguracaoUsuario } from '../../core/models/configuracao.model';

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
export class ComunicacaoComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // ==========================================
  // SIGNALS - Estado Reativo
  // ==========================================
  categorias = signal<Categoria[]>([]);
  categoriaSelecionada = signal<Categoria | null>(null);
  pictogramas = signal<Pictograma[]>([]);
  pictogramasSelecionados = signal<PictogramaSelecionado[]>([]);
  pictogramasMaisUsados = signal<Pictograma[]>([]);
  configuracao = signal<ConfiguracaoUsuario | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);
  sucessoMensagem = signal<string | null>(null);
  mostrarMaisUsados = signal(false);

  // ==========================================
  // COMPUTED - Valores Derivados
  // ==========================================
  textoCompleto = computed(() =>
    this.pictogramasSelecionados()
      .map(p => p.pictograma.label)
      .join(' ')
  );

  conteudoJson = computed(() =>
    JSON.stringify(
      this.pictogramasSelecionados().map(p => ({
        pictogramaId: p.pictograma.id,
        label: p.pictograma.label,
        timestamp: p.timestamp
      }))
    )
  );

  modoEscuro = computed(() => this.configuracao()?.modoEscuro ?? false);

  modoAltoContraste = computed(() => this.configuracao()?.modoAltoContraste ?? false);

  temPictogramasSelecionados = computed(() => this.pictogramasSelecionados().length > 0);

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor(
    private categoriaService: CategoriaService,
    private pictogramaService: PictogramaService,
    private mensagemService: MensagemService,
    private speechService: SpeechService,
    private authService: AuthService,
    private configuracaoService: ConfiguracaoService,
    private router: Router
  ) {
    // Effect para auto-limpar erros após 5 segundos
    effect(() => {
      const erro = this.error();
      if (erro) {
        setTimeout(() => this.error.set(null), 5000);
      }
    });

    // Effect para auto-limpar mensagens de sucesso
    effect(() => {
      const sucesso = this.sucessoMensagem();
      if (sucesso) {
        setTimeout(() => this.sucessoMensagem.set(null), 3000);
      }
    });
  }

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  ngOnInit(): void {
    this.verificarAutenticacao();
    this.carregarConfiguracao();
    this.carregarCategorias();
    this.carregarPictogramasMaisUsados();
    this.inicializarSpeechService();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.speechService.stop();
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================
  private verificarAutenticacao(): void {
    if (!this.authService.usuarioId) {
      console.error('Usuário não autenticado');
      this.router.navigate(['/login']);
    }
  }

  private inicializarSpeechService(): void {
    // Configura voz em português
    this.speechService.setLanguage('pt-BR');
    this.speechService.setRate(0.9);

    // Subscreve ao status da fala (opcional - para UI de feedback)
    this.speechService.status$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        // Aqui você pode atualizar a UI baseado no status
        // Por exemplo: mostrar animação de "falando"
        if (status.speaking) {
          console.log('Falando:', status.text);
        }
      });
  }

  // ==========================================
  // CARREGAMENTO DE DADOS
  // ==========================================
  carregarConfiguracao(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.configuracaoService.obter(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: config => {
          this.configuracao.set(config);

          // Aplica configurações ao SpeechService
          // velocidadeVoz vem como 50-200 (%), então divide por 100
          if (config.velocidadeVoz) {
            this.speechService.setRate(config.velocidadeVoz / 100);
          }

          // Define idioma da voz
          if (config.idiomaVoz) {
            this.speechService.setLanguage(config.idiomaVoz);
          }
        },
        error: err => {
          console.error('Erro ao carregar configuração:', err);
          this.error.set('Não foi possível carregar suas configurações');
        }
      });
  }

  carregarCategorias(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.loading.set(true);
    this.error.set(null);

    this.categoriaService.listarDisponiveis(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: categorias => {
          const ativas = categorias.filter(c => c.ativa);

          // Ordena por ordem ou por nome
          ativas.sort((a, b) => {
            if (a.ordem !== undefined && b.ordem !== undefined) {
              return a.ordem - b.ordem;
            }
            return a.nome.localeCompare(b.nome);
          });

          this.categorias.set(ativas);

          // Seleciona primeira categoria automaticamente
          if (ativas.length > 0 && !this.categoriaSelecionada()) {
            this.selecionarCategoria(ativas[0]);
          }

          this.loading.set(false);
        },
        error: err => {
          console.error('Erro ao carregar categorias:', err);
          this.error.set('Erro ao carregar categorias. Tente novamente.');
          this.loading.set(false);
        }
      });
  }

  carregarPictogramasMaisUsados(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.pictogramaService.listarMaisUsados(userId, 12)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: lista => this.pictogramasMaisUsados.set(lista),
        error: err => console.error('Erro ao carregar mais usados:', err)
      });
  }

  // ==========================================
  // CATEGORIAS
  // ==========================================
  selecionarCategoria(categoria: Categoria): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    this.categoriaSelecionada.set(categoria);
    this.loading.set(true);
    this.error.set(null);

    this.pictogramaService.listarPorCategoria(categoria.id, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: lista => {
          const ativos = lista.filter(p => p.ativo);

          // Ordena por mais usado ou alfabeticamente
          ativos.sort((a, b) => {
            if (a.vezesUsado && b.vezesUsado) {
              return b.vezesUsado - a.vezesUsado;
            }
            return a.label.localeCompare(b.label);
          });

          this.pictogramas.set(ativos);
          this.loading.set(false);
        },
        error: err => {
          console.error('Erro ao carregar pictogramas:', err);
          this.error.set('Erro ao carregar pictogramas desta categoria');
          this.loading.set(false);
        }
      });
  }

  adicionarCategoria(): void {
    // TODO: Implementar modal/dialog para criar categoria
    console.log('Adicionar nova categoria');
    this.error.set('Funcionalidade em desenvolvimento');
  }

  // ==========================================
  // PICTOGRAMAS
  // ==========================================
  selecionarPictograma(pictograma: Pictograma): void {
    // Adiciona à lista de selecionados
    this.pictogramasSelecionados.update(lista => [
      ...lista,
      {
        pictograma,
        timestamp: Date.now()
      }
    ]);

    // Registra uso no backend (fire and forget)
    this.pictogramaService.registrarUso(pictograma.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: err => console.error('Erro ao registrar uso:', err)
      });

    // Se configurado, fala o label ao selecionar
    const cfg = this.configuracao();
    if (cfg?.habilitarSom && cfg?.confirmarSelecao) {
      this.speechService.speak(pictograma.label);
    }

    // Atualiza lista de mais usados (debounced)
    this.atualizarMaisUsados();
  }

  private atualizarMaisUsados(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    // Atualiza após 2 segundos sem interação
    setTimeout(() => {
      this.carregarPictogramasMaisUsados();
    }, 2000);
  }

  adicionarPictograma(): void {
    // TODO: Implementar modal/dialog para criar pictograma
    console.log('Adicionar novo pictograma');
    this.error.set('Funcionalidade em desenvolvimento');
  }

  // ==========================================
  // MANIPULAÇÃO DA FRASE
  // ==========================================
  removerPictogramaPorIndex(index: number): void {
    this.pictogramasSelecionados.update(lista => {
      const nova = [...lista];
      nova.splice(index, 1);
      return nova;
    });
  }

  removerUltimoPictograma(): void {
    this.pictogramasSelecionados.update(lista => {
      if (lista.length === 0) return lista;
      return lista.slice(0, -1);
    });
  }

  limparSelecao(): void {
    this.pictogramasSelecionados.set([]);
    this.speechService.stop();
  }

  // ==========================================
  // FALA
  // ==========================================
  falarMensagem(): void {
    const texto = this.textoCompleto();

    if (!texto || texto.trim().length === 0) {
      this.error.set('Selecione pictogramas para formar uma mensagem');
      return;
    }

    this.speechService.speak(texto);
  }

  // ==========================================
  // SALVAR MENSAGEM
  // ==========================================
  salvarMensagem(): void {
    const userId = this.authService.usuarioId;
    if (!userId) return;

    const lista = this.pictogramasSelecionados();
    if (lista.length === 0) {
      this.error.set('Nenhum pictograma selecionado para salvar');
      return;
    }

    const mensagemDTO = {
      conteudoJson: this.conteudoJson(),
      textoCompleto: this.textoCompleto(),
      contexto: this.categoriaSelecionada()?.nome || 'Geral',
      dispositivoOrigem: this.detectarDispositivo()
    };

    this.mensagemService.salvar(mensagemDTO, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sucessoMensagem.set('Mensagem salva no histórico! ✅');

          // Se configurado, limpa após salvar
          if (this.configuracao()?.salvarHistorico) {
            setTimeout(() => this.limparSelecao(), 1000);
          }
        },
        error: err => {
          console.error('Erro ao salvar mensagem:', err);
          this.error.set('Não foi possível salvar a mensagem');
        }
      });
  }

  private detectarDispositivo(): string {
    const width = window.innerWidth;
    if (width < 768) return 'MOBILE';
    if (width < 1024) return 'TABLET';
    return 'DESKTOP';
  }

  // ==========================================
  // PAINEL MAIS USADOS
  // ==========================================
  toggleMaisUsados(): void {
    this.mostrarMaisUsados.update(v => !v);
  }

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================
  abrirConfiguracoes(): void {
    this.router.navigate(['/configuracoes']);
  }

  abrirHistorico(): void {
    this.router.navigate(['/historico']);
  }

  // ==========================================
  // ATALHOS DE TECLADO (ACESSIBILIDADE)
  // ==========================================
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Ctrl/Cmd + Enter: Falar mensagem
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.falarMensagem();
    }

    // Ctrl/Cmd + Backspace: Remover último
    if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
      event.preventDefault();
      this.removerUltimoPictograma();
    }

    // Ctrl/Cmd + L: Limpar tudo
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
      event.preventDefault();
      this.limparSelecao();
    }

    // Ctrl/Cmd + S: Salvar mensagem
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.salvarMensagem();
    }

    // ESC: Parar fala
    if (event.key === 'Escape') {
      this.speechService.stop();
    }
  }
}
