import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  // Rota de Login SEM layout (tela limpa)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },

  // Rotas COM layout (menu + navbar)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'comunicacao',
        pathMatch: 'full'
      },
      {
        path: 'comunicacao',
        loadComponent: () => import('./features/comunicacao/comunicacao.component').then(m => m.ComunicacaoComponent)
      },
      {
        path: 'historico',
        loadComponent: () => import('./features/historico/Historico').then(m => m.HistoricoComponent)
      },
      {
        path: 'frases-favoritas',
        loadComponent: () => import('./features/frases-favoritas/frases-favoritas.component').then(m => m.FrasesFavoritasComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./features/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
      }
    ]
  },

  // Redirect catch-all
  {
    path: '**',
    redirectTo: '/comunicacao'
  }
];
