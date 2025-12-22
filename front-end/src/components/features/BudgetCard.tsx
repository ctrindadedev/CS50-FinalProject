import React from 'react';
import { formatCurrency, formatCategoryLabel } from '@/utils/formatters';
import { getCategoryInfo } from '@/utils/categories';
import { cn } from '@/lib/utils';
import type { Budget } from '@/types';
import { Progress } from '@/components/ui/progress';

interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onClick }) => {
  const category = getCategoryInfo(budget.category);
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const isOverBudget = budget.spent > budget.limit;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-xl bg-card border border-border/50',
        'hover:shadow-md hover:border-border transition-all duration-200',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span style={{ color: category.color }}>{category.label.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-medium">{formatCategoryLabel(budget.category)}</h3>
            <p className="text-sm text-muted-foreground">Monthly budget</p>
          </div>
        </div>
        {isOverBudget && (
          <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
            Over budget
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className={cn('font-medium', isOverBudget && 'text-destructive')}>
            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
          </span>
        </div>
        <Progress
          value={percentage}
          className={cn(
            'h-2',
            isOverBudget && '[&>div]:bg-destructive'
          )}
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {percentage.toFixed(0)}% used
          </span>
          <span className={cn(
            'font-medium',
            isOverBudget ? 'text-destructive' : 'text-income'
          )}>
            {isOverBudget ? 'Over by ' : 'Remaining: '}
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </div>
    </div>
  );
};
