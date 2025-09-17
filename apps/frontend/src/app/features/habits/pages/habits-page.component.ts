import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HabitsService } from '../services/habits.service';

interface HabitIdea {
  title: string;
  description: string;
}

@Component({
  selector: 'app-habits-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  template: `
    <section class="habits">
      <header>
        <h1>Hábitos financieros</h1>
        <p>Refuerza tus objetivos incorporando pequeñas acciones en tu rutina diaria.</p>
      </header>

      <p *ngIf="loading()" class="status">Cargando recomendaciones...</p>
      <p *ngIf="error()" class="status error">{{ error() }}</p>
      <p *ngIf="message() && !loading() && !error()" class="status info">{{ message() }}</p>

      <section class="ideas">
        <article *ngFor="let idea of ideas" class="idea">
          <h2>{{ idea.title }}</h2>
          <p>{{ idea.description }}</p>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .habits {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      header h1 {
        margin: 0;
        font-size: 2rem;
        color: #0f172a;
      }

      header p {
        margin: 0.5rem 0 0;
        color: #475569;
      }

      .status {
        margin: 0;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        background: #e0f2fe;
        color: #0369a1;
        font-weight: 500;
      }

      .status.error {
        background: #fef2f2;
        color: #b91c1c;
      }

      .status.info {
        background: #ecfdf5;
        color: #047857;
      }

      .ideas {
        display: grid;
        gap: 1.5rem;
      }

      @media (min-width: 768px) {
        .ideas {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .idea {
        background: #fff;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 20px 50px -30px rgba(15, 23, 42, 0.35);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .idea h2 {
        margin: 0;
        color: #1e293b;
      }

      .idea p {
        margin: 0;
        color: #475569;
      }
    `,
  ],
})
export class HabitsPageComponent implements OnInit {
  private readonly habitsService = inject(HabitsService);

  readonly loading = signal(true);
  readonly message = signal('');
  readonly error = signal<string | null>(null);

  readonly ideas: HabitIdea[] = [
    {
      title: 'Revisión semanal de gastos',
      description: 'Reserva 15 minutos cada fin de semana para registrar tus movimientos recientes y clasificar tus gastos.',
    },
    {
      title: 'Fondo de emergencias',
      description: 'Automatiza un pequeño ahorro mensual para construir un fondo que cubra al menos tres meses de gastos.',
    },
    {
      title: 'Día sin gastos',
      description: 'Elige un día a la semana en el que evites compras no esenciales y analiza cómo te sentiste.',
    },
    {
      title: 'Visualiza tu objetivo',
      description: 'Define un objetivo financiero concreto y colócalo en un lugar visible para recordarte por qué estás ahorrando.',
    },
  ];

  ngOnInit(): void {
    this.habitsService
      .getWelcomeMessage()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (message) => {
          this.message.set(message);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al obtener hábitos', error);
          this.error.set('No se pudo cargar el mensaje inicial.');
          this.loading.set(false);
        },
      });
  }
}
