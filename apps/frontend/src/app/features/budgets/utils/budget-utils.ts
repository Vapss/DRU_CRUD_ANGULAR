import { SelectOption } from './select-option.model';

export const MONTH_OPTIONS: ReadonlyArray<SelectOption<number>> = [
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
] as const;

export function buildYearRange(currentYear: number, yearsBefore = 2, yearsAfter = 2): number[] {
  const startYear = currentYear - yearsBefore;
  const endYear = currentYear + yearsAfter;
  const range: number[] = [];

  for (let year = startYear; year <= endYear; year += 1) {
    range.push(year);
  }

  return range;
}
