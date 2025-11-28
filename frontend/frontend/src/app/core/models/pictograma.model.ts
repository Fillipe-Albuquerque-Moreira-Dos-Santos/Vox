export enum TipoPictograma {
  ICONE = 'ICONE',
  EMOJI = 'EMOJI',
  IMAGEM = 'IMAGEM'
}

export interface Pictograma {
  id: number;
  label: string;
  labelAlternativo?: string;
  cor: string;
  icone?: string;
  imagemUrl?: string;
  tipo: TipoPictograma;
  ativo: boolean;
  padrao: boolean;
  ordem: number;
  vezesUsado: number;
  categoriaId: number;
  categoriaNome?: string;
  usuarioId?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PictogramaCreate {
  label: string;
  labelAlternativo?: string;
  cor: string;
  icone?: string;
  imagemUrl?: string;
  tipo: TipoPictograma;
  ordem: number;
  categoriaId: number;
}
