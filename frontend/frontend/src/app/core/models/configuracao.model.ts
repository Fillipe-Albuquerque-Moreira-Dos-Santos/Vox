export enum TamanhoPictograma {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE'
}

export interface ConfiguracaoUsuario {
  id: number;
  usuarioId: number;
  tamanhoPictograma: TamanhoPictograma;
  modoAltoContraste: boolean;
  modoEscuro: boolean;
  habilitarSom: boolean;
  velocidadeVoz: number;
  idiomaVoz?: string;
  modoVarredura: boolean;
  tempoVarredura: number;
  confirmarSelecao: boolean;
  salvarHistorico: boolean;
  permitirRelatorios: boolean;
  atualizadoEm: string;
}
