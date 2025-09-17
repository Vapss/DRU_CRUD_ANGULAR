import { CommonModule, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';

import { CategoriesListComponent } from '../components/categories-list.component';
import { CategoryFormComponent } from '../components/category-form.component';
import { BudgetFiltersComponent } from '../components/budget-filters.component';
import { BudgetSummaryComponent } from '../components/budget-summary.component';
import { TransactionFormComponent } from '../components/transaction-form.component';
import { TransactionsTableComponent } from '../components/transactions-table.component';
import { BudgetsService } from '../services/budgets.service';
import { MONTH_OPTIONS, buildYearRange } from '../utils/budget-utils';
import { SelectOption } from '../utils/select-option.model';
import { Category, CategoryType, MonthReport, Transaction } from '../../../shared/models/budget.model';

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    BudgetFiltersComponent,
    BudgetSummaryComponent,
    TransactionsTableComponent,
    TransactionFormComponent,
    CategoriesListComponent,
    CategoryFormComponent,
  ],
  template: `
    <div class="budgets">
      <section class="page-header">
        <div>
          <h1>Gestión de presupuestos</h1>
          <p>Registra ingresos y gastos, y controla tus categorías personales.</p>
        </div>
        <app-budget-filters [filterForm]="filterForm" [months]="months" [years]="years"></app-budget-filters>
      </section>

      <app-budget-summary *ngIf="summary() as summaryData" [summary]="summaryData"></app-budget-summary>

      <p *ngIf="loading()" class="status">Cargando información...</p>
      <p *ngIf="successMessage()" class="status success">{{ successMessage() }}</p>
      <p *ngIf="errorMessage()" class="status error">{{ errorMessage() }}</p>

      <div class="grid">
        <app-transactions-table
          [transactions]="transactions()"
          [categories]="categories()"
        ></app-transactions-table>
        <app-transaction-form
          [form]="transactionForm"
          [categories]="categories()"
          [saving]="savingTransaction()"
          (submitted)="submitTransaction()"
        ></app-transaction-form>
      </div>

      <div class="grid categories-grid">
        <app-categories-list [categories]="categories()"></app-categories-list>
        <app-category-form
          [form]="categoryForm"
          [saving]="savingCategory()"
          (submitted)="submitCategory()"
        ></app-category-form>
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

      .categories-grid {
        margin-bottom: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsPageComponent implements OnInit {
  private readonly budgetsService = inject(BudgetsService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly today = new Date();
  private readonly currentYear = this.today.getFullYear();
  private readonly currentMonth = this.today.getMonth() + 1;

  readonly months: ReadonlyArray<SelectOption<number>> = MONTH_OPTIONS;
  readonly years = buildYearRange(this.currentYear);

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshPeriodData());

    this.loadCategories();
    this.refreshPeriodData();
  }

  submitTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const raw = this.transactionForm.getRawValue();
    const parsedAmount = typeof raw.amount === 'number' ? raw.amount : Number(raw.amount);
    const amountControl = this.transactionForm.get('amount');

    if (!Number.isFinite(parsedAmount)) {
      if (amountControl) {
        const errors = { ...(amountControl.errors ?? {}) };
        errors['invalidNumber'] = true;
        amountControl.setErrors(errors);
        amountControl.markAsTouched();
      }
      this.showError('El monto debe ser un número válido.');
      return;
    }

    if (amountControl?.errors?.['invalidNumber']) {
      const { invalidNumber, ...otherErrors } = amountControl.errors ?? {};
      if (Object.keys(otherErrors).length) {
        amountControl.setErrors(otherErrors);
      } else {
        amountControl.setErrors(null);
      }
    }

    const payload = {
      amount: parsedAmount,
      tx_date: raw.tx_date ?? this.formatDate(this.today),
      note: raw.note ?? '',
      category_id: raw.category_id ?? null,
    };

    this.savingTransaction.set(true);
    this.clearMessages();

    this.budgetsService
      .createTransaction(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.savingTransaction.set(false)))
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
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.savingCategory.set(false)))
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
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
