// 📁 src/app/core/models/auth.models.ts
// CRIAR ESTE ARQUIVO NOVO!

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role?: string;
}

export interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface TokenDTO {
  token: string;
  tipo?: string;
}
