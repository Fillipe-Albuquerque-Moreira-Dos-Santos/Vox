import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  senha = '';
  loading = signal(false);
  erro = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.senha) {
      this.erro.set('Preencha todos os campos');
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    // Simulação de login - substitua por chamada real à API
    setTimeout(() => {
      const usuario = {
        id: 1,
        nome: 'Usuário Demo',
        email: this.email,
        role: 'USER'
      };

      this.authService.login(usuario);
      this.router.navigate(['/dashboard']);
      this.loading.set(false);
    }, 1000);
  }

  loginDemo(): void {
    this.email = 'demo@vox.com';
    this.senha = 'demo123';
    this.login();
  }
}
