export interface Mensagem {
  id: number;
  conteudoJson: string;
  textoCompleto: string;
  contexto?: string;
  usuarioId: number;
  usuarioNome?: string;
  criadoEm: string;
  favorita: boolean;
  vezesReutilizada: number;
  dispositivoOrigem?: string;
}

export interface MensagemCreate {
  conteudoJson: string;
  textoCompleto: string;
  contexto?: string;
  dispositivoOrigem?: string;
}

export interface Estatisticas {
  totalMensagens: number;
  mensagensNoPeriodo: number;
}
