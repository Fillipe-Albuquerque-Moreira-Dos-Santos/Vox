import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ConfiguracaoService } from '../core/services/configuracao.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen" [class.bg-gray-900]="modoEscuro()">

      <!-- Menu de Navegação -->
      <nav class="shadow-lg sticky top-0 z-50"
           [class.bg-gray-800]="modoEscuro()"
           [class.bg-blue-600]="!modoEscuro()">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">

            <!-- Logo -->
            <div class="flex items-center">
              <span class="text-2xl font-bold text-white">🗣️ VOX</span>
            </div>

            <!-- Menu Desktop -->
            <div class="hidden md:flex space-x-4">

              <a routerLink="/comunicacao"
                 routerLinkActive="bg-blue-700"
                 class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium">
                 💬 Comunicação
              </a>

              <a routerLink="/frases-favoritas"
                 routerLinkActive="bg-blue-700"
                 class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium">
                 ⭐ Frases Favoritas
              </a>

              <a routerLink="/historico"
                 routerLinkActive="bg-blue-700"
                 class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium">
                 📜 Histórico
              </a>

              <a routerLink="/categorias"
                 routerLinkActive="bg-blue-700"
                 class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium">
                 📂 Categorias
              </a>

              <a routerLink="/configuracoes"
                 routerLinkActive="bg-blue-700"
                 class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium">
                 ⚙️ Configurações
              </a>

            </div>

            <!-- Usuário e Logout -->
            <div class="flex items-center gap-4">
              <span class="text-white font-medium hidden md:block">
                👤 {{ currentUser()?.nome }}
              </span>

              <button
                (click)="logout()"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors">
                🚪 Sair
              </button>
            </div>

            <!-- Menu Mobile Toggle -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden text-white p-2">
              <span class="text-2xl">☰</span>
            </button>

          </div>

          <!-- Menu Mobile -->
          @if (mobileMenuOpen()) {
            <div class="md:hidden pb-4">
              <div class="flex flex-col space-y-2">

                <a routerLink="/comunicacao"
                   routerLinkActive="bg-blue-700"
                   (click)="closeMobileMenu()"
                   class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                   💬 Comunicação
                </a>

                <a routerLink="/frases-favoritas"
                   routerLinkActive="bg-blue-700"
                   (click)="closeMobileMenu()"
                   class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                   ⭐ Frases Favoritas
                </a>

                <a routerLink="/historico"
                   routerLinkActive="bg-blue-700"
                   (click)="closeMobileMenu()"
                   class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                   📜 Histórico
                </a>

                <a routerLink="/categorias"
                   routerLinkActive="bg-blue-700"
                   (click)="closeMobileMenu()"
                   class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                   📂 Categorias
                </a>

                <a routerLink="/configuracoes"
                   routerLinkActive="bg-blue-700"
                   (click)="closeMobileMenu()"
                   class="px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                   ⚙️ Configurações
                </a>

              </div>
            </div>
          }

        </div>
      </nav>

      <!-- Conteúdo Principal -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: []
})
export class MainLayoutComponent {

  mobileMenuOpen = signal(false);

  constructor(
    private authService: AuthService,
    private configuracaoService: ConfiguracaoService,
    private router: Router
  ) {
    const usuarioId = this.authService.usuarioId;
    if (usuarioId) {
      this.configuracaoService.obter(usuarioId).subscribe();
    }
  }

  currentUser = computed(() => this.authService.currentUserValue);
  modoEscuro = computed(() => this.configuracaoService.getConfiguracao()?.modoEscuro || false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
