import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, RouterLink],
  template: `
    <div class="auth-page">
      <section class="intro">
        <h1>DRU Presupuestos</h1>
        <p>Gestiona tus finanzas, crea categorías personalizadas y controla tus hábitos financieros.</p>
      </section>

      <section class="card">
        <header>
          <h2>{{ mode() === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}</h2>
          <p>
            {{ mode() === 'login' ? 'Accede con tus credenciales' : 'Regístrate para comenzar a usar la plataforma' }}
          </p>
        </header>

        <form *ngIf="mode() === 'login'; else registerForm" [formGroup]="loginForm" (ngSubmit)="submitLogin()">
          <label>
            <span>Correo electrónico</span>
            <input type="email" formControlName="email" placeholder="tu@correo.com" required />
          </label>
          <label>
            <span>Contraseña</span>
            <input type="password" formControlName="password" placeholder="••••••••" required />
          </label>
          <button type="submit" [disabled]="loginForm.invalid || loading()">Ingresar</button>
        </form>

        <ng-template #registerForm>
          <form [formGroup]="registerForm" (ngSubmit)="submitRegister()">
            <label>
              <span>Nombre completo</span>
              <input type="text" formControlName="full_name" placeholder="Tu nombre" required />
            </label>
            <label>
              <span>Correo electrónico</span>
              <input type="email" formControlName="email" placeholder="tu@correo.com" required />
            </label>
            <label>
              <span>Contraseña</span>
              <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres" required />
            </label>
            <button type="submit" [disabled]="registerForm.invalid || loading()">Crear cuenta</button>
          </form>
        </ng-template>

        <p *ngIf="successMessage()" class="status success">{{ successMessage() }}</p>
        <p *ngIf="errorMessage()" class="status error">{{ errorMessage() }}</p>

        <p class="switch">
          <ng-container *ngIf="mode() === 'login'; else loginLink">
            ¿No tienes una cuenta?
            <button type="button" (click)="toggleMode()">Regístrate</button>
          </ng-container>
          <ng-template #loginLink>
            ¿Ya tienes una cuenta?
            <button type="button" (click)="toggleMode()">Inicia sesión</button>
          </ng-template>
        </p>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: calc(100vh - 120px);
      }

      .auth-page {
        display: grid;
        gap: 2rem;
        align-items: start;
      }

      @media (min-width: 992px) {
        .auth-page {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: center;
        }
      }

      .intro {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .intro h1 {
        margin: 0;
        font-size: 2.5rem;
        color: #0f172a;
      }

      .intro p {
        margin: 0;
        color: #475569;
        font-size: 1.05rem;
      }

      .card {
        background: #fff;
        padding: 2rem;
        border-radius: 1.25rem;
        box-shadow: 0 25px 60px -35px rgba(15, 23, 42, 0.4);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .card header h2 {
        margin: 0;
        font-size: 1.75rem;
        color: #1f2937;
      }

      .card header p {
        margin: 0.5rem 0 0;
        color: #64748b;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      label span {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 600;
        color: #334155;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.9rem;
        border: 1px solid #cbd5f5;
        font-size: 1rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }

      button[type='submit'] {
        align-self: flex-start;
        padding: 0.75rem 1.75rem;
        border-radius: 9999px;
        border: none;
        background: linear-gradient(135deg, #6366f1, #22d3ee);
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button[type='submit']:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      button[type='submit']:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -15px rgba(14, 116, 144, 0.6);
      }

      .switch {
        margin: 0;
        color: #475569;
        font-weight: 500;
      }

      .switch button {
        background: none;
        border: none;
        color: #2563eb;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        margin-left: 0.25rem;
      }

      .switch button:hover {
        text-decoration: underline;
      }

      .status {
        margin: 0;
        padding: 0.75rem 1rem;
        border-radius: 0.9rem;
        font-weight: 500;
      }

      .status.success {
        background: #ecfdf5;
        color: #047857;
      }

      .status.error {
        background: #fef2f2;
        color: #b91c1c;
      }
    `,
  ],
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');
  readonly loading = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly registerForm = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.clearMessages();

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
          this.errorMessage.set('No se pudo iniciar sesión. Verifica tus credenciales.');
        },
      });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.clearMessages();

    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
          this.mode.set('login');
          this.loginForm.patchValue({
            email: response.email,
            password: '',
          });
        },
        error: (error) => {
          console.error('Error al registrar usuario', error);
          this.errorMessage.set('No se pudo completar el registro. Intenta nuevamente.');
        },
      });
  }

  toggleMode(): void {
    this.mode.update((value) => (value === 'login' ? 'register' : 'login'));
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
