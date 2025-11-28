export interface FraseFavorita {
  id: number;
  titulo: string;
  conteudoJson: string;
  textoCompleto: string;
  ativa: boolean;
  ordem: number;
  vezesUsada: number;
  usuarioId: number;
  criadoEm: string;
  atualizadoEm: string;
}
