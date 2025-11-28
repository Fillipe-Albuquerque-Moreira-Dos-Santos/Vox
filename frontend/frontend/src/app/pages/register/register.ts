import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('✅ Usuário registrado com sucesso!', response);
        this.loading.set(false);
        alert('Conta criada com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Erro no registro:', err);
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erro ao criar conta. Tente novamente.');
      }
    });
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) return 'Campo obrigatório';
    if (control?.hasError('email')) return 'E-mail inválido';
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    return '';
  }
}
