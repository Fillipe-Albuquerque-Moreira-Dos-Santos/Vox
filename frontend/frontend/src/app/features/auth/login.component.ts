import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
    // Validações básicas
    console.log('🔍 Iniciando login...'); // 👈 ADICIONE
    console.log('📧 Email:', this.email);   // 👈 ADICIONE
    console.log('🔑 Senha:', this.senha);   // 👈 ADICIONE
    if (!this.email || !this.senha) {
      this.erro.set('Preencha todos os campos');
      return;
    }

    if (!this.isEmailValido(this.email)) {
      this.erro.set('Email inválido');
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    // Chamada real à API
    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        console.log('✅ Login realizado com sucesso!', response);
        this.loading.set(false);
        void this.router.navigate(['/comunicacao']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erro no login:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        this.loading.set(false);

        if (error.status === 401 || error.status === 403) {
          this.erro.set('Email ou senha incorretos');
        } else if (error.status === 404) {
          this.erro.set('Usuário não encontrado');
        } else if (error.status === 0) {
          this.erro.set('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          this.erro.set(error.error?.message || 'Erro ao realizar login. Tente novamente.');
        }
      }
    });
  }


  loginDemo(): void {
    // Para demonstração - ajuste com credenciais válidas no seu banco
    this.email = 'demo@vox.com';
    this.senha = 'demo123';
    this.login();
  }

  /**
   * Validação simples de email
   */
  private isEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
