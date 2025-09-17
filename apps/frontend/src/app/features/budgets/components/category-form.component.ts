import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Nueva categoría</h2>
      <form [formGroup]="form" (ngSubmit)="submitted.emit()">
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
        <button type="submit" [disabled]="form.invalid || saving">Crear categoría</button>
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

      input[type='text'] {
        width: 100%;
        padding: 0.65rem 0.75rem;
        border-radius: 0.75rem;
        border: 1px solid #cbd5f5;
        font-size: 0.95rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input[type='text']:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() saving = false;

  @Output() submitted = new EventEmitter<void>();
}
