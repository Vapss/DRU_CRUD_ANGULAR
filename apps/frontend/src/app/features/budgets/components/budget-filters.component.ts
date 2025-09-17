import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SelectOption } from '../utils/select-option.model';

@Component({
  selector: 'app-budget-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
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
  `,
  styles: [
    `
      .filters {
        display: flex;
        gap: 1rem;
        align-items: center;
        background: #fff;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -15px rgba(15, 23, 42, 0.2);
      }

      label {
        display: flex;
        flex-direction: column;
        font-weight: 500;
        color: #334155;
      }

      select {
        margin-top: 0.25rem;
        border: 1px solid #cbd5f5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.95rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFiltersComponent {
  @Input({ required: true }) filterForm!: FormGroup<{
    year: FormControl<number>;
    month: FormControl<number>;
  }>;

  @Input({ required: true }) months: ReadonlyArray<SelectOption<number>> = [];
  @Input({ required: true }) years: ReadonlyArray<number> = [];
}
