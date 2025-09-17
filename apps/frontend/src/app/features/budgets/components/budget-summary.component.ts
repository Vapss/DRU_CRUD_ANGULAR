import { CurrencyPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MonthReport } from '../../../shared/models/budget.model';

@Component({
  selector: 'app-budget-summary',
  standalone: true,
  imports: [NgIf, CurrencyPipe],
  template: `
    <section class="summary" *ngIf="summary as data">
      <article class="summary-card income">
        <h3>Ingresos</h3>
        <p>{{ data.income | currency: 'USD':'symbol':'1.2-2' }}</p>
      </article>
      <article class="summary-card expense">
        <h3>Gastos</h3>
        <p>{{ data.expense | currency: 'USD':'symbol':'1.2-2' }}</p>
      </article>
      <article class="summary-card balance">
        <h3>Balance</h3>
        <p>{{ data.balance | currency: 'USD':'symbol':'1.2-2' }}</p>
      </article>
    </section>
  `,
  styles: [
    `
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetSummaryComponent {
  @Input() summary: MonthReport | null = null;
}
