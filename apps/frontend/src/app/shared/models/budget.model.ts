export type DecimalLike = number | string;

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  user_id: number;
}

export interface CategoryPayload {
  name: string;
  type: CategoryType;
}

export interface CategoryReportDto {
  category: string;
  total: DecimalLike;
}

export interface CategoryReport {
  category: string;
  total: number;
}

export interface TransactionDto {
  id: number;
  amount: DecimalLike;
  tx_date: string;
  note: string;
  category_id: number | null;
  user_id: number;
}

export interface Transaction extends Omit<TransactionDto, 'amount'> {
  amount: number;
}

export interface TransactionPayload {
  amount: number;
  tx_date: string;
  note?: string;
  category_id?: number | null;
}

export interface TransactionFilters {
  year?: number;
  month?: number;
}

export interface MonthReportDto {
  income: DecimalLike;
  expense: DecimalLike;
  balance: DecimalLike;
  byCategory: CategoryReportDto[];
}

export interface MonthReport extends Omit<MonthReportDto, 'income' | 'expense' | 'balance' | 'byCategory'> {
  income: number;
  expense: number;
  balance: number;
  byCategory: CategoryReport[];
}
