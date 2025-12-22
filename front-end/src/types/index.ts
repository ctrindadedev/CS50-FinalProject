export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'gifts'
  | 'other_income'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'subscriptions'
  | 'other_expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  month: string; // Format: YYYY-MM
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  category: TransactionCategory;
  limit: number;
  month: string;
}

export interface CategoryInfo {
  id: TransactionCategory;
  label: string;
  icon: string;
  type: TransactionType;
  color: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface TransactionFilter {
  type?: TransactionType;
  category?: TransactionCategory;
  dateRange?: DateRange;
  search?: string;
}

export interface TransactionSort {
  field: 'date' | 'amount' | 'category';
  direction: 'asc' | 'desc';
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface ExportData {
  transactions: Transaction[];
  budgets: Budget[];
  exportedAt: string;
  version: string;
}
