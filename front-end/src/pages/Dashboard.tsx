import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import {
  StatCard,
  TransactionList,
  ExpensePieChart,
  MonthlyBarChart,
  BudgetCard,
  TransactionForm,
} from '@/components/features';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTransactions, useCreateTransaction } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency } from '@/utils/formatters';
import { getCategoryInfo, getExpenseCategories } from '@/utils/categories';
import type { TransactionFormData } from '@/types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const createTransaction = useCreateTransaction();
  
  const currentMonth = format(new Date(), 'yyyy-MM');
  const { data: budgets = [] } = useBudgets(currentMonth);

  // Calculate stats
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
    };
  }, [transactions]);

  // Calculate expense by category for pie chart
  const expenseByCategory = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + t.amount);
      });

    return Array.from(categoryTotals.entries())
      .map(([category, value]) => {
        const info = getCategoryInfo(category as any);
        return {
          name: info.label,
          value,
          color: info.color,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  // Calculate monthly data for bar chart
  const monthlyData = useMemo(() => {
    const monthTotals = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach((t) => {
      const month = format(new Date(t.date), 'MMM yyyy');
      const current = monthTotals.get(month) || { income: 0, expense: 0 };
      
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      
      monthTotals.set(month, current);
    });

    return Array.from(monthTotals.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .reverse()
      .slice(-6);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = (data: TransactionFormData) => {
    createTransaction.mutate(data, {
      onSuccess: () => setIsAddDialogOpen(false),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your financial overview.
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setIsAddDialogOpen(false)}
                isLoading={createTransaction.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Balance"
            value={formatCurrency(stats.totalBalance)}
            subtitle="All time"
            variant="balance"
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatCard
            title="Total Income"
            value={formatCurrency(stats.totalIncome)}
            subtitle="All transactions"
            variant="income"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpense)}
            subtitle="All transactions"
            variant="expense"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Overview */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
            <MonthlyBarChart data={monthlyData} />
          </div>

          {/* Expense Distribution */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
            <ExpensePieChart data={expenseByCategory} />
          </div>
        </div>

        {/* Budgets */}
        {budgets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Budget Progress</h2>
              <Link to="/budgets">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {budgets.slice(0, 3).map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <TransactionList
            transactions={recentTransactions}
            isLoading={transactionsLoading}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
