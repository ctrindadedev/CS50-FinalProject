import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'balance';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
}) => {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-income';
    if (trend < 0) return 'text-expense';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'relative p-6 rounded-2xl border overflow-hidden',
        'transition-all duration-200 hover:shadow-lg',
        variant === 'default' && 'bg-card border-border/50',
        variant === 'income' && 'bg-income/10 border-income/20',
        variant === 'expense' && 'bg-expense/10 border-expense/20',
        variant === 'balance' && 'gradient-primary text-primary-foreground border-transparent'
      )}
    >
      {/* Background decoration */}
      {variant === 'balance' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              'text-sm font-medium',
              variant === 'balance' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {title}
          </span>
          {icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                variant === 'balance'
                  ? 'bg-white/20'
                  : variant === 'income'
                  ? 'bg-income/20 text-income'
                  : variant === 'expense'
                  ? 'bg-expense/20 text-expense'
                  : 'bg-muted'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <p
          className={cn(
            'text-3xl font-bold tracking-tight',
            variant === 'income' && 'text-income',
            variant === 'expense' && 'text-expense'
          )}
        >
          {value}
        </p>

        {/* Subtitle / Trend */}
        {(subtitle || trend !== undefined) && (
          <div className="flex items-center gap-2 mt-2">
            {trend !== undefined && (
              <span className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
                {getTrendIcon()}
                {Math.abs(trend).toFixed(1)}%
              </span>
            )}
            {subtitle && (
              <span
                className={cn(
                  'text-sm',
                  variant === 'balance' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
