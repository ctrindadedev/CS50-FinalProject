import type { Budget, BudgetFormData, TransactionCategory } from '@/types';
import { transactionService } from './transactionService';

const STORAGE_KEY = 'financeflow_budgets';

const generateId = (): string => {
  return `bgt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getStoredBudgets = (): Budget[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const saveBudgets = (budgets: Budget[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
};

const generateMockBudgets = (): Budget[] => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const categories: { category: TransactionCategory; limit: number }[] = [
    { category: 'food', limit: 500 },
    { category: 'transport', limit: 200 },
    { category: 'entertainment', limit: 150 },
    { category: 'shopping', limit: 300 },
    { category: 'utilities', limit: 250 },
    { category: 'subscriptions', limit: 100 },
  ];
  
  return categories.map(({ category, limit }) => ({
    id: generateId(),
    category,
    limit,
    spent: 0, // Will be calculated
    month: currentMonth,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const budgetService = {
  async getAll(month?: string): Promise<Budget[]> {
    let budgets = getStoredBudgets();
    
    // Initialize with mock data if empty
    if (budgets.length === 0) {
      budgets = generateMockBudgets();
      saveBudgets(budgets);
    }
    
    // Filter by month if provided
    if (month) {
      budgets = budgets.filter(b => b.month === month);
    }
    
    // Calculate spent amounts from transactions
    const transactions = await transactionService.getAll();
    
    budgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => {
          const txnMonth = new Date(t.date).toISOString().slice(0, 7);
          return t.type === 'expense' && t.category === budget.category && txnMonth === budget.month;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { ...budget, spent };
    });
    
    return budgets;
  },

  async getById(id: string): Promise<Budget | null> {
    const budgets = getStoredBudgets();
    return budgets.find(b => b.id === id) || null;
  },

  async create(data: BudgetFormData): Promise<Budget> {
    const budgets = getStoredBudgets();
    const now = new Date().toISOString();
    
    // Check if budget for this category and month already exists
    const existing = budgets.find(b => b.category === data.category && b.month === data.month);
    if (existing) {
      throw new Error('Budget for this category and month already exists');
    }
    
    const newBudget: Budget = {
      id: generateId(),
      ...data,
      spent: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    budgets.push(newBudget);
    saveBudgets(budgets);
    
    return newBudget;
  },

  async update(id: string, data: Partial<BudgetFormData>): Promise<Budget> {
    const budgets = getStoredBudgets();
    const index = budgets.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error('Budget not found');
    }
    
    const updatedBudget: Budget = {
      ...budgets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    budgets[index] = updatedBudget;
    saveBudgets(budgets);
    
    return updatedBudget;
  },

  async delete(id: string): Promise<void> {
    const budgets = getStoredBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    saveBudgets(filtered);
  },
};
