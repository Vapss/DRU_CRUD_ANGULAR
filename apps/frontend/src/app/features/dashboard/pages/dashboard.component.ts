import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';

import { BudgetsService } from '../../budgets/services/budgets.service';
import { MonthReport, Transaction } from '../../../shared/models/budget.model';

interface SelectOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ReactiveFormsModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    <section class="dashboard">
      <header class="dashboard-header">
        <div>
          <h1>Resumen financiero</h1>
          <p>Visualiza rápidamente tus ingresos, gastos y balance del mes seleccionado.</p>
        </div>
        <form [formGroup]="filterForm" class="filters">
          <label>
            <span>Mes</span>
            <select formControlName="month">
              <option *ngFor="let month of months" [ngValue]="month.value">{{ month.label }}</option>
            </select>
          </label>
          <label>
            <span>Año</span>
            <select formControlName="year">
              <option *ngFor="let year of years" [ngValue]="year">{{ year }}</option>
            </select>
          </label>
        </form>
      </header>

      <section class="cards" *ngIf="summary() as data">
        <article class="card income">
          <h3>Ingresos</h3>
          <p>{{ data.income | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
        <article class="card expense">
          <h3>Gastos</h3>
          <p>{{ data.expense | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
        <article class="card balance">
          <h3>Balance</h3>
          <p>{{ data.balance | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
      </section>

      <p *ngIf="loading()" class="status">Cargando información...</p>
      <p *ngIf="errorMessage()" class="status error">{{ errorMessage() }}</p>

      <section class="grid">
        <article class="panel">
          <header>
            <h2>Movimientos recientes</h2>
            <a routerLink="/budgets">Ir a presupuestos →</a>
          </header>
          <ng-container *ngIf="transactions().length; else noTransactions">
            <ul class="timeline">
              <li *ngFor="let tx of transactions(); trackBy: trackByTransaction">
                <span class="date">{{ tx.tx_date | date:'mediumDate' }}</span>
                <div class="info">
                  <p class="note">{{ tx.note || 'Sin nota' }}</p>
                  <span class="amount" [class.positive]="tx.amount > 0" [class.negative]="tx.amount < 0">
                    {{ tx.amount | currency:'USD':'symbol':'1.2-2' }}
                  </span>
                </div>
              </li>
            </ul>
          </ng-container>
          <ng-template #noTransactions>
            <p class="empty">No hay movimientos registrados en el periodo seleccionado.</p>
          </ng-template>
        </article>

        <article class="panel">
          <header>
            <h2>Distribución por categorías</h2>
            <a routerLink="/budgets">Administrar categorías →</a>
          </header>
          <ng-container *ngIf="summary()?.byCategory.length; else emptyCategories">
            <ul class="categories">
              <li *ngFor="let item of summary()?.byCategory">
                <span class="category">{{ item.category }}</span>
                <span class="total" [class.positive]="item.total > 0" [class.negative]="item.total < 0">
                  {{ item.total | currency:'USD':'symbol':'1.2-2' }}
                </span>
              </li>
            </ul>
          </ng-container>
          <ng-template #emptyCategories>
            <p class="empty">Aún no se registran movimientos por categoría.</p>
          </ng-template>
        </article>
      </section>

      <section class="callouts">
        <article>
          <h3>Registra nuevos hábitos</h3>
          <p>Utiliza la sección de hábitos para planear pequeñas acciones que refuercen tus objetivos financieros.</p>
          <a routerLink="/habits">Ver hábitos →</a>
        </article>
        <article>
          <h3>Agrega transacciones</h3>
          <p>Mantén tu flujo actualizado registrando ingresos y gastos en la sección de presupuestos.</p>
          <a routerLink="/budgets">Registrar transacciones →</a>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dashboard {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .dashboard-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1.5rem;
        align-items: center;
      }

      .dashboard-header h1 {
        margin: 0;
        font-size: 2rem;
        color: #0f172a;
      }

      .dashboard-header p {
        margin: 0.5rem 0 0;
        color: #475569;
      }

      .filters {
        display: flex;
        gap: 1rem;
        align-items: center;
        background: #fff;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 15px 30px -20px rgba(15, 23, 42, 0.2);
      }

      .filters label {
        display: flex;
        flex-direction: column;
        color: #334155;
        font-weight: 600;
      }

      .filters select {
        margin-top: 0.25rem;
        border: 1px solid #cbd5f5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .card {
        background: #fff;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 20px 45px -30px rgba(15, 23, 42, 0.35);
      }

      .card h3 {
        margin: 0;
        font-size: 1rem;
        color: #334155;
      }

      .card p {
        margin: 0.75rem 0 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .card.income p {
        color: #10b981;
      }

      .card.expense p {
        color: #ef4444;
      }

      .card.balance p {
        color: #6366f1;
      }

      .status {
        margin: 0;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        font-weight: 500;
        background: #fffbea;
        color: #854d0e;
      }

      .status.error {
        background: #fef2f2;
        color: #b91c1c;
      }

      .grid {
        display: grid;
        gap: 2rem;
      }

      @media (min-width: 992px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .panel {
        background: #fff;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 15px 40px -30px rgba(15, 23, 42, 0.35);
      }

      .panel header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .panel h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1f2937;
      }

      .panel a {
        color: #2563eb;
        font-weight: 600;
        text-decoration: none;
      }

      .panel a:hover {
        text-decoration: underline;
      }

      .timeline {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .timeline li {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .timeline .date {
        min-width: 110px;
        font-weight: 600;
        color: #475569;
      }

      .timeline .info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .timeline .note {
        margin: 0;
        color: #1f2937;
      }

      .timeline .amount {
        font-weight: 700;
      }

      .timeline .amount.positive {
        color: #047857;
      }

      .timeline .amount.negative {
        color: #dc2626;
      }

      .categories {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .categories li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
      }

      .categories .category {
        font-weight: 600;
        color: #1f2937;
      }

      .categories .total {
        font-weight: 600;
      }

      .categories .total.positive {
        color: #047857;
      }

      .categories .total.negative {
        color: #b91c1c;
      }

      .empty {
        margin: 1rem 0 0;
        color: #6b7280;
      }

      .callouts {
        display: grid;
        gap: 1rem;
      }

      @media (min-width: 768px) {
        .callouts {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .callouts article {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1));
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-radius: 1rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .callouts h3 {
        margin: 0;
        color: #1e293b;
      }

      .callouts p {
        margin: 0;
        color: #475569;
      }

      .callouts a {
        align-self: flex-start;
        font-weight: 600;
        color: #2563eb;
        text-decoration: none;
      }

      .callouts a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly budgetsService = inject(BudgetsService);
  private readonly fb = inject(FormBuilder);

  private readonly today = new Date();
  private readonly currentYear = this.today.getFullYear();
  private readonly currentMonth = this.today.getMonth() + 1;

  readonly months: SelectOption<number>[] = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly years = Array.from({ length: 5 }, (_, index) => this.currentYear - 2 + index);

  readonly summary = signal<MonthReport | null>(null);
  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly filterForm = this.fb.nonNullable.group({
    year: [this.currentYear],
    month: [this.currentMonth],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.loadData());
    this.loadData();
  }

  trackByTransaction = (_: number, tx: Transaction) => tx.id;

  private loadData(): void {
    const { year, month } = this.filterForm.getRawValue();
    if (!year || !month) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      summary: this.budgetsService.getMonthReport(year, month),
      transactions: this.budgetsService.getTransactions({ year, month }),
    })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ summary, transactions }) => {
          this.summary.set(summary);
          this.transactions.set(transactions.slice(0, 5));
        },
        error: (error) => {
          console.error('Error al cargar el dashboard', error);
          this.errorMessage.set('No se pudo cargar el resumen. Intenta nuevamente.');
        },
      });
  }
}
