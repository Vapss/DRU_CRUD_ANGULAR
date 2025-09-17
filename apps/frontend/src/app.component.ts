import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from './app/features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <a routerLink="/" class="brand">DRU Presupuestos</a>
        <nav *ngIf="isLoggedIn" class="main-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/budgets" routerLinkActive="active">Presupuestos</a>
          <a routerLink="/habits" routerLinkActive="active">Hábitos</a>
        </nav>
        <button *ngIf="isLoggedIn" type="button" (click)="logout()" class="logout">Cerrar sesión</button>
        <a *ngIf="!isLoggedIn" routerLink="/auth" class="login-link">Iniciar sesión</a>
      </header>

      <main class="app-content">
        <router-outlet />
      </main>

      <footer class="app-footer">
        <small>© {{ currentYear }} DRU Finanzas personales</small>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f5f6fa;
        color: #1f2933;
        font-family: 'Segoe UI', Roboto, sans-serif;
      }

      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background: #111827;
        color: #fff;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .brand {
        font-size: 1.125rem;
        font-weight: 600;
        color: inherit;
        text-decoration: none;
      }

      .main-nav {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .main-nav a {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        font-weight: 500;
        padding-bottom: 0.25rem;
        border-bottom: 2px solid transparent;
        transition: color 0.2s ease, border-color 0.2s ease;
      }

      .main-nav a:hover,
      .main-nav a.active {
        color: #fff;
        border-color: #22d3ee;
      }

      .logout,
      .login-link {
        background: none;
        border: none;
        color: #fca5a5;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
      }

      .logout:hover,
      .login-link:hover {
        color: #f87171;
      }

      .app-content {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .app-footer {
        padding: 1.5rem 2rem;
        text-align: center;
        background: #111827;
        color: rgba(255, 255, 255, 0.65);
      }

      @media (max-width: 768px) {
        .app-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .app-content {
          padding: 1.5rem 1rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  constructor(private readonly authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}
