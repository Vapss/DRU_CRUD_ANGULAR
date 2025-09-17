import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category, Transaction } from '../../../shared/models/budget.model';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe],
  template: `
    <section class="card">
      <header class="header">
        <h2>Transacciones del periodo</h2>
        <p *ngIf="transactions?.length">{{ transactions.length }} movimientos registrados</p>
      </header>
      <ng-container *ngIf="transactions?.length; else empty">
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
              <tr *ngFor="let tx of transactions; trackBy: trackByTransaction">
                <td>{{ tx.tx_date | date: 'longDate' }}</td>
                <td>{{ tx.note || 'Sin nota' }}</td>
                <td>{{ resolveCategory(tx.category_id) }}</td>
                <td class="numeric" [class.positive]="tx.amount > 0" [class.negative]="tx.amount < 0">
                  {{ tx.amount | currency: 'USD':'symbol':'1.2-2' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
      <ng-template #empty>
        <p class="empty">No hay transacciones registradas para el mes seleccionado.</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .card {
        background: #fff;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 20px 45px -30px rgba(15, 23, 42, 0.4);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
      }

      p {
        margin: 0;
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

      .numeric {
        text-align: right;
      }

      .positive {
        color: #047857;
      }

      .negative {
        color: #dc2626;
      }

      .empty {
        margin: 1rem 0 0;
        color: #6b7280;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  @Input() transactions: ReadonlyArray<Transaction> = [];
  @Input() categories: ReadonlyArray<Category> = [];

  trackByTransaction = (_: number, tx: Transaction) => tx.id;

  resolveCategory(categoryId: number | null): string {
    if (categoryId == null) {
      return 'Sin categoría';
    }

    const category = this.categories.find((item) => item.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }
}
