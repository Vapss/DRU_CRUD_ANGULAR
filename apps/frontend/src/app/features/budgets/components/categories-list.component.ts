import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category } from '../../../shared/models/budget.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="card">
      <h2>Categorías</h2>
      <ul *ngIf="categories?.length; else empty">
        <li *ngFor="let category of categories">
          <span class="name">{{ category.name }}</span>
          <span class="tag" [class.income]="category.type === 'income'" [class.expense]="category.type === 'expense'">
            {{ category.type === 'income' ? 'Ingreso' : 'Gasto' }}
          </span>
        </li>
      </ul>
      <ng-template #empty>
        <p class="empty">Aún no tienes categorías creadas.</p>
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

      h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
      }

      ul {
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
      }

      .name {
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

      .income {
        background: rgba(16, 185, 129, 0.1);
        color: #047857;
      }

      .expense {
        background: rgba(239, 68, 68, 0.1);
        color: #b91c1c;
      }

      .empty {
        margin: 1rem 0 0;
        color: #6b7280;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
  @Input() categories: ReadonlyArray<Category> = [];
}
