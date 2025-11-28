import {Pictograma} from './pictograma.model';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  cor: string;
  icone?: string;
  ativa: boolean;
  padrao: boolean;
  ordem: number;
  usuarioId?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CategoriaComPictogramas extends Categoria {
  pictogramas: Pictograma[];
}
