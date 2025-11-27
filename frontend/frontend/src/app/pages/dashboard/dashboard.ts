// 📁 src/app/pages/dashboard/dashboard.ts
// SUBSTITUIR O CONTEÚDO EXISTENTE

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { UsuarioService } from '../../core/services/usuario';
import { Usuario } from '../../core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    public authService: Auth,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar usuários');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
