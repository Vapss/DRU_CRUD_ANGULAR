import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Category } from '../../../shared/models/budget.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, NgIf],
  template: `
    <section class="card">
      <h2>Registrar nueva transacción</h2>
      <form [formGroup]="form" (ngSubmit)="submitted.emit()">
        <div class="field-row">
          <label>
            <span>Monto</span>
            <input type="number" formControlName="amount" step="0.01" placeholder="Ej. 1500" required />
            <small class="error" *ngIf="form.get('amount')?.touched && form.get('amount')?.errors?.['invalidNumber']">
              Ingresa un número válido.
            </small>
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
            <option *ngFor="let category of categories" [ngValue]="category.id">
              {{ category.name }} ({{ category.type === 'income' ? 'Ingreso' : 'Gasto' }})
            </option>
          </select>
        </label>
        <button type="submit" [disabled]="form.invalid || saving">Guardar transacción</button>
      </form>
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
        margin: 0 0 1rem;
        font-size: 1.25rem;
        color: #1e293b;
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

      .error {
        display: block;
        margin-top: 0.35rem;
        font-size: 0.8rem;
        color: #b91c1c;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() categories: ReadonlyArray<Category> = [];
  @Input() saving = false;

  @Output() submitted = new EventEmitter<void>();
}
