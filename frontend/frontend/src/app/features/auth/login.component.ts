import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        <!-- Logo e Título -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🗣️</div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">VOX</h1>
          <p class="text-gray-600">Comunicação Aumentativa e Alternativa</p>
        </div>

        <!-- Formulário -->
        <form (ngSubmit)="login()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="seu@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              [(ngModel)]="senha"
              name="senha"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          @if (erro()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {{ erro() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            @if (loading()) {
              <span>Entrando...</span>
            } @else {
              <span>Entrar</span>
            }
          </button>
        </form>

        <!-- Login de Demonstração -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-600 text-center mb-3">Para demonstração, use:</p>
          <button
            (click)="loginDemo()"
            class="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
            Login de Demonstração
          </button>
        </div>
      </div>
    </div>
  `
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
      this.router.navigate(['/comunicacao']);
      this.loading.set(false);
    }, 1000);
  }

  loginDemo(): void {
    this.email = 'demo@vox.com';
    this.senha = 'demo123';
    this.login();
  }
}
