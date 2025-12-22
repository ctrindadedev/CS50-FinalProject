import React from 'react';
import { formatCurrency, formatRelativeDate } from '@/utils/formatters';
import { getCategoryInfo } from '@/utils/categories';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus,
  Utensils,
  Car,
  Zap,
  Film,
  ShoppingBag,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
  Trash2,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus,
  Utensils,
  Car,
  Zap,
  Film,
  ShoppingBag,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
};

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl bg-card animate-pulse"
          >
            <div className="w-12 h-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="h-5 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => {
        const category = getCategoryInfo(transaction.category);
        const Icon = iconMap[category.icon] || MoreHorizontal;
        const isIncome = transaction.type === 'income';

        return (
          <div
            key={transaction.id}
            className={cn(
              'group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50',
              'hover:shadow-md hover:border-border transition-all duration-200',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Category Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: category.color }} />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{category.label}</span>
                <span>•</span>
                <span>{formatRelativeDate(transaction.date)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p
                className={cn(
                  'font-semibold text-lg',
                  isIncome ? 'text-income' : 'text-expense'
                )}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  className="h-8 w-8 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
