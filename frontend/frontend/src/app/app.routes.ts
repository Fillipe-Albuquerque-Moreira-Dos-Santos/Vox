import { Routes } from '@angular/router';
import { authGuard } from "../core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/comunicacao',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'comunicacao',
    loadComponent: () => import('./features/comunicacao/comunicacao.component').then(m => m.ComunicacaoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'historico',
    loadComponent: () => import('./features/historico/historico.component').then(m => m.HistoricoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'frases-favoritas',
    loadComponent: () => import('./features/frases-favoritas/frases-favoritas.component').then(m => m.FrasesFavoritasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./features/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/comunicacao'
  }
];
