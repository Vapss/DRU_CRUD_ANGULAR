import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';

import { BudgetsService } from '../services/budgets.service';
import { Category, CategoryType, MonthReport, Transaction } from '../../../shared/models/budget.model';

interface SelectOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ReactiveFormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="budgets">
      <section class="page-header">
        <div>
          <h1>Gestión de presupuestos</h1>
          <p>Registra ingresos y gastos, y controla tus categorías personales.</p>
        </div>
        <form class="filters" [formGroup]="filterForm">
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
      </section>

      <section class="summary" *ngIf="summary() as data">
        <article class="summary-card income">
          <h3>Ingresos</h3>
          <p>{{ data.income | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
        <article class="summary-card expense">
          <h3>Gastos</h3>
          <p>{{ data.expense | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
        <article class="summary-card balance">
          <h3>Balance</h3>
          <p>{{ data.balance | currency:'USD':'symbol':'1.2-2' }}</p>
        </article>
      </section>

      <p *ngIf="loading()" class="status">Cargando información...</p>
      <p *ngIf="successMessage()" class="status success">{{ successMessage() }}</p>
      <p *ngIf="errorMessage()" class="status error">{{ errorMessage() }}</p>

      <div class="grid">
        <section class="transactions">
          <header>
            <h2>Transacciones del periodo</h2>
            <p *ngIf="transactions().length">{{ transactions().length }} movimientos registrados</p>
          </header>
          <ng-container *ngIf="transactions().length; else emptyTransactions">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th class="numeric">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let tx of transactions(); trackBy: trackByTransaction">
                    <td>{{ tx.tx_date | date:'longDate' }}</td>
                    <td>{{ tx.note || 'Sin nota' }}</td>
                    <td>{{ categoryLabel(tx.category_id) }}</td>
                    <td class="numeric" [class.positive]="tx.amount > 0" [class.negative]="tx.amount < 0">
                      {{ tx.amount | currency:'USD':'symbol':'1.2-2' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ng-container>
          <ng-template #emptyTransactions>
            <p class="empty">No hay transacciones registradas para el mes seleccionado.</p>
          </ng-template>
        </section>

        <section class="form-card">
          <h2>Registrar nueva transacción</h2>
          <form [formGroup]="transactionForm" (ngSubmit)="submitTransaction()">
            <div class="field-row">
              <label>
                <span>Monto</span>
                <input type="number" formControlName="amount" step="0.01" placeholder="Ej. 1500" required />
              </label>
              <label>
                <span>Fecha</span>
                <input type="date" formControlName="tx_date" required />
              </label>
            </div>
            <label>
              <span>Nota</span>
              <input type="text" formControlName="note" placeholder="Descripción opcional" />
            </label>
            <label>
              <span>Categoría</span>
              <select formControlName="category_id">
                <option [ngValue]="null">Sin categoría</option>
                <option *ngFor="let category of categories()" [ngValue]="category.id">
                  {{ category.name }} ({{ category.type === 'income' ? 'Ingreso' : 'Gasto' }})
                </option>
              </select>
            </label>
            <button type="submit" [disabled]="transactionForm.invalid || savingTransaction()">Guardar transacción</button>
          </form>
        </section>
      </div>

      <div class="grid categories-grid">
        <section class="categories">
          <h2>Categorías</h2>
          <ul *ngIf="categories().length; else emptyCategories">
            <li *ngFor="let category of categories(); trackBy: trackByCategory">
              <span class="name">{{ category.name }}</span>
              <span class="tag" [class.income]="category.type === 'income'" [class.expense]="category.type === 'expense'">
                {{ category.type === 'income' ? 'Ingreso' : 'Gasto' }}
              </span>
            </li>
          </ul>
          <ng-template #emptyCategories>
            <p class="empty">Aún no tienes categorías creadas.</p>
          </ng-template>
        </section>

        <section class="form-card">
          <h2>Nueva categoría</h2>
          <form [formGroup]="categoryForm" (ngSubmit)="submitCategory()">
            <label>
              <span>Nombre</span>
              <input type="text" formControlName="name" placeholder="Ej. Vivienda" required />
            </label>
            <label>
              <span>Tipo</span>
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" formControlName="type" [value]="'income'" />
                  <span>Ingreso</span>
                </label>
                <label class="radio">
                  <input type="radio" formControlName="type" [value]="'expense'" />
                  <span>Gasto</span>
                </label>
              </div>
            </label>
            <button type="submit" [disabled]="categoryForm.invalid || savingCategory()">Crear categoría</button>
          </form>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .budgets {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .page-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1.5rem;
        align-items: center;
      }

      .page-header h1 {
        margin: 0;
        font-size: 2rem;
        color: #0f172a;
      }

      .page-header p {
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
        box-shadow: 0 10px 25px -15px rgba(15, 23, 42, 0.2);
      }

      .filters label {
        display: flex;
        flex-direction: column;
        font-weight: 500;
        color: #334155;
      }

      .filters select {
        margin-top: 0.25rem;
        border: 1px solid #cbd5f5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.95rem;
      }

      .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .summary-card {
        background: #fff;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 15px 35px -20px rgba(15, 23, 42, 0.3);
      }

      .summary-card h3 {
        margin: 0;
        font-size: 1rem;
        color: #334155;
      }

      .summary-card p {
        margin: 0.75rem 0 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .summary-card.income p {
        color: #10b981;
      }

      .summary-card.expense p {
        color: #ef4444;
      }

      .summary-card.balance p {
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

      .status.success {
        background: #ecfdf5;
        color: #047857;
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
          grid-template-columns: 2fr 1fr;
        }
      }

      .transactions,
      .form-card,
      .categories {
        background: #fff;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 20px 45px -30px rgba(15, 23, 42, 0.4);
      }

      .transactions header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .transactions h2,
      .form-card h2,
      .categories h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid #e2e8f0;
        text-align: left;
      }

      th {
        font-size: 0.85rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: #64748b;
      }

      td {
        color: #1f2937;
      }

      td.numeric,
      th.numeric {
        text-align: right;
      }

      td.positive {
        color: #047857;
      }

      td.negative {
        color: #dc2626;
      }

      .empty {
        margin: 1rem 0 0;
        color: #6b7280;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      label span {
        display: block;
        font-weight: 600;
        color: #334155;
        margin-bottom: 0.35rem;
      }

      input,
      select {
        width: 100%;
        padding: 0.65rem 0.75rem;
        border-radius: 0.75rem;
        border: 1px solid #cbd5f5;
        font-size: 0.95rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }

      .field-row {
        display: grid;
        gap: 1rem;
      }

      @media (min-width: 640px) {
        .field-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      button {
        align-self: flex-start;
        padding: 0.65rem 1.5rem;
        border-radius: 9999px;
        border: none;
        font-weight: 600;
        background: linear-gradient(135deg, #6366f1, #22d3ee);
        color: #fff;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }

      button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -15px rgba(14, 116, 144, 0.6);
      }

      .radio-group {
        display: flex;
        gap: 1.5rem;
      }

      .radio {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        color: #475569;
      }

      .categories ul {
        list-style: none;
        margin: 1rem 0 0;
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

      .categories .name {
        font-weight: 600;
        color: #1f2937;
      }

      .tag {
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: #e2e8f0;
        color: #475569;
      }

      .tag.income {
        background: rgba(16, 185, 129, 0.1);
        color: #047857;
      }

      .tag.expense {
        background: rgba(239, 68, 68, 0.1);
        color: #b91c1c;
      }

      .categories-grid {
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class BudgetsPageComponent implements OnInit {
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

  readonly categories = signal<Category[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly summary = signal<MonthReport | null>(null);
  readonly loading = signal(false);
  readonly savingTransaction = signal(false);
  readonly savingCategory = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly filterForm = this.fb.nonNullable.group({
    year: [this.currentYear],
    month: [this.currentMonth],
  });

  readonly transactionForm = this.fb.group({
    amount: [null as number | null, [Validators.required]],
    tx_date: [this.formatDate(this.today), [Validators.required]],
    note: [''],
    category_id: [null as number | null],
  });

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['expense' as CategoryType, Validators.required],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.refreshPeriodData());

    this.loadCategories();
    this.refreshPeriodData();
  }

  trackByTransaction = (_: number, tx: Transaction) => tx.id;
  trackByCategory = (_: number, category: Category) => category.id;

  submitTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const raw = this.transactionForm.getRawValue();
    const amount = raw.amount ?? 0;
    const payload = {
      amount: typeof amount === 'number' ? amount : Number(amount),
      tx_date: raw.tx_date ?? this.formatDate(this.today),
      note: raw.note ?? '',
      category_id: raw.category_id ?? null,
    };

    this.savingTransaction.set(true);
    this.clearMessages();

    this.budgetsService
      .createTransaction(payload)
      .pipe(takeUntilDestroyed(), finalize(() => this.savingTransaction.set(false)))
      .subscribe({
        next: () => {
          this.showSuccess('Transacción registrada correctamente.');
          this.transactionForm.reset({
            amount: null,
            tx_date: this.formatDate(this.today),
            note: '',
            category_id: null,
          });
          this.refreshPeriodData();
        },
        error: (error) => {
          console.error('Error al crear la transacción', error);
          this.showError('No se pudo registrar la transacción.');
        },
      });
  }

  submitCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = this.categoryForm.getRawValue();

    this.savingCategory.set(true);
    this.clearMessages();

    this.budgetsService
      .createCategory(payload)
      .pipe(takeUntilDestroyed(), finalize(() => this.savingCategory.set(false)))
      .subscribe({
        next: (category) => {
          this.showSuccess(`Categoría "${category.name}" creada correctamente.`);
          this.categoryForm.reset({ name: '', type: payload.type });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al crear la categoría', error);
          this.showError('No se pudo crear la categoría.');
        },
      });
  }

  categoryLabel(categoryId: number | null): string {
    if (categoryId == null) {
      return 'Sin categoría';
    }

    const category = this.categories().find((item) => item.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  private refreshPeriodData(): void {
    const { year, month } = this.filterForm.getRawValue();
    if (!year || !month) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      transactions: this.budgetsService.getTransactions({ year, month }),
      summary: this.budgetsService.getMonthReport(year, month),
    })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ transactions, summary }) => {
          this.transactions.set(transactions);
          this.summary.set(summary);
        },
        error: (error) => {
          console.error('Error al cargar la información del periodo', error);
          this.showError('No se pudo cargar la información del periodo.');
        },
      });
  }

  private loadCategories(): void {
    this.budgetsService
      .getCategories()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: (error) => {
          console.error('Error al obtener las categorías', error);
          this.showError('No se pudieron cargar las categorías.');
        },
      });
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set(null);
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.successMessage.set(null);
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
