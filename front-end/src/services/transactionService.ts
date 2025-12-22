import type { Transaction, TransactionFormData, TransactionFilter, TransactionSort } from '@/types';

const STORAGE_KEY = 'financeflow_transactions';

// Helper to generate unique IDs
const generateId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get transactions from localStorage
const getStoredTransactions = (): Transaction[] => {
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

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

// Generate mock transactions for demo
const generateMockTransactions = (): Transaction[] => {
  const now = new Date();
  const transactions: Transaction[] = [];
  
  const incomeCategories = ['salary', 'freelance', 'investments', 'gifts'] as const;
  const expenseCategories = ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'healthcare', 'subscriptions'] as const;
  
  // Generate last 3 months of transactions
  for (let month = 0; month < 3; month++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    
    // Add salary
    transactions.push({
      id: generateId(),
      type: 'income',
      amount: 5000 + Math.random() * 1000,
      category: 'salary',
      description: 'Monthly Salary',
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Add random expenses
    for (let i = 0; i < 15 + Math.floor(Math.random() * 10); i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      
      transactions.push({
        id: generateId(),
        type: 'expense',
        amount: Math.floor(Math.random() * 200) + 10,
        category,
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    // Add random income
    if (Math.random() > 0.5) {
      const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      transactions.push({
        id: generateId(),
        type: 'income',
        amount: Math.floor(Math.random() * 500) + 100,
        category,
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} income`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const transactionService = {
  async getAll(filter?: TransactionFilter, sort?: TransactionSort): Promise<Transaction[]> {
    let transactions = getStoredTransactions();
    
    // Initialize with mock data if empty
    if (transactions.length === 0) {
      transactions = generateMockTransactions();
      saveTransactions(transactions);
    }
    
    // Apply filters
    if (filter) {
      if (filter.type) {
        transactions = transactions.filter(t => t.type === filter.type);
      }
      if (filter.category) {
        transactions = transactions.filter(t => t.category === filter.category);
      }
      if (filter.dateRange?.from) {
        transactions = transactions.filter(t => new Date(t.date) >= filter.dateRange!.from!);
      }
      if (filter.dateRange?.to) {
        transactions = transactions.filter(t => new Date(t.date) <= filter.dateRange!.to!);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Apply sorting
    if (sort) {
      transactions.sort((a, b) => {
        let comparison = 0;
        switch (sort.field) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
        }
        return sort.direction === 'desc' ? -comparison : comparison;
      });
    } else {
      // Default sort by date descending
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return transactions;
  },

  async getById(id: string): Promise<Transaction | null> {
    const transactions = getStoredTransactions();
    return transactions.find(t => t.id === id) || null;
  },

  async create(data: TransactionFormData): Promise<Transaction> {
    const transactions = getStoredTransactions();
    const now = new Date().toISOString();
    
    const newTransaction: Transaction = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    transactions.unshift(newTransaction);
    saveTransactions(transactions);
    
    return newTransaction;
  },

  async update(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    const transactions = getStoredTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    const updatedTransaction: Transaction = {
      ...transactions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    transactions[index] = updatedTransaction;
    saveTransactions(transactions);
    
    return updatedTransaction;
  },

  async delete(id: string): Promise<void> {
    const transactions = getStoredTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
  },

  async deleteAll(): Promise<void> {
    saveTransactions([]);
  },
};
