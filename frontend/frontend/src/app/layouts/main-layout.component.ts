import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { ConfiguracaoService } from '../core/services/configuracao.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
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

  get currentUser() {
    return this.authService.currentUser();
  }

  modoEscuro = computed(() =>
    this.configuracaoService.getConfiguracao()?.modoEscuro ?? false
  );

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
