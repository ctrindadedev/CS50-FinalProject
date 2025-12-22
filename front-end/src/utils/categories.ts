import type { CategoryInfo, TransactionCategory } from '@/types';

export const categories: CategoryInfo[] = [
  // Income categories
  { id: 'salary', label: 'Salary', icon: 'Briefcase', type: 'income', color: 'hsl(142, 71%, 45%)' },
  { id: 'freelance', label: 'Freelance', icon: 'Laptop', type: 'income', color: 'hsl(173, 58%, 39%)' },
  { id: 'investments', label: 'Investments', icon: 'TrendingUp', type: 'income', color: 'hsl(199, 89%, 48%)' },
  { id: 'gifts', label: 'Gifts', icon: 'Gift', type: 'income', color: 'hsl(262, 83%, 58%)' },
  { id: 'other_income', label: 'Other Income', icon: 'Plus', type: 'income', color: 'hsl(38, 92%, 50%)' },
  
  // Expense categories
  { id: 'food', label: 'Food & Dining', icon: 'Utensils', type: 'expense', color: 'hsl(0, 84%, 60%)' },
  { id: 'transport', label: 'Transport', icon: 'Car', type: 'expense', color: 'hsl(38, 92%, 50%)' },
  { id: 'utilities', label: 'Utilities', icon: 'Zap', type: 'expense', color: 'hsl(199, 89%, 48%)' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Film', type: 'expense', color: 'hsl(262, 83%, 58%)' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: 'hsl(330, 81%, 60%)' },
  { id: 'healthcare', label: 'Healthcare', icon: 'Heart', type: 'expense', color: 'hsl(0, 72%, 51%)' },
  { id: 'education', label: 'Education', icon: 'GraduationCap', type: 'expense', color: 'hsl(173, 58%, 39%)' },
  { id: 'travel', label: 'Travel', icon: 'Plane', type: 'expense', color: 'hsl(142, 71%, 45%)' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'CreditCard', type: 'expense', color: 'hsl(222, 47%, 40%)' },
  { id: 'other_expense', label: 'Other Expense', icon: 'MoreHorizontal', type: 'expense', color: 'hsl(215, 16%, 47%)' },
];

export const getCategoryInfo = (categoryId: TransactionCategory): CategoryInfo => {
  return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
};

export const getIncomeCategories = (): CategoryInfo[] => {
  return categories.filter(c => c.type === 'income');
};

export const getExpenseCategories = (): CategoryInfo[] => {
  return categories.filter(c => c.type === 'expense');
};

export const getCategoriesByType = (type: 'income' | 'expense'): CategoryInfo[] => {
  return categories.filter(c => c.type === type);
};
