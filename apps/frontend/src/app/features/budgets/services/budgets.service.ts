import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import {
  Category,
  CategoryPayload,
  CategoryReport,
  CategoryReportDto,
  MonthReport,
  MonthReportDto,
  Transaction,
  TransactionDto,
  TransactionFilters,
  TransactionPayload,
} from '../../../shared/models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  constructor(private readonly http: HttpService) {}

  getCategories() {
    return this.http
      .get<Category[]>('/budgets/categories')
      .pipe(map((categories) => [...categories].sort((a, b) => a.name.localeCompare(b.name))));
  }

  createCategory(payload: CategoryPayload) {
    return this.http.post<Category>('/budgets/categories', payload);
  }

  getTransactions(filters?: TransactionFilters) {
    const params = this.serializeFilters(filters);
    return this.http
      .get<TransactionDto[]>('/budgets/transactions', { params })
      .pipe(map((transactions) => transactions.map((tx) => this.normalizeTransaction(tx))));
  }

  createTransaction(payload: TransactionPayload) {
    return this.http
      .post<TransactionDto>('/budgets/transactions', payload)
      .pipe(map((tx) => this.normalizeTransaction(tx)));
  }

  getMonthReport(year: number, month: number) {
    return this.http
      .get<MonthReportDto>('/budgets/reports/month', { params: { year, month } })
      .pipe(map((report) => this.normalizeReport(report)));
  }

  private normalizeTransaction(dto: TransactionDto): Transaction {
    return {
      ...dto,
      amount: typeof dto.amount === 'number' ? dto.amount : Number(dto.amount ?? 0),
    };
  }

  private normalizeReport(dto: MonthReportDto): MonthReport {
    return {
      income: this.toNumber(dto.income),
      expense: this.toNumber(dto.expense),
      balance: this.toNumber(dto.balance),
      byCategory: dto.byCategory.map((item) => this.normalizeCategoryReport(item)),
    };
  }

  private normalizeCategoryReport(dto: CategoryReportDto): CategoryReport {
    return {
      category: dto.category,
      total: this.toNumber(dto.total),
    };
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private serializeFilters(filters?: TransactionFilters) {
    if (!filters) {
      return undefined;
    }

    const params: Record<string, number> = {};
    if (filters.year) {
      params['year'] = filters.year;
    }
    if (filters.month) {
      params['month'] = filters.month;
    }
    return Object.keys(params).length ? params : undefined;
  }
}
