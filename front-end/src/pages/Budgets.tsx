import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout';
import { BudgetCard } from '@/components/features';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@/hooks/useBudgets';
import { getExpenseCategories } from '@/utils/categories';
import { formatCurrency } from '@/utils/formatters';
import type { Budget, BudgetFormData, TransactionCategory } from '@/types';
import { Loader2 } from 'lucide-react';

const budgetSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  limit: z.coerce.number().positive('Limit must be positive'),
  month: z.string().min(1, 'Month is required'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const Budgets: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const currentMonth = format(new Date(), 'yyyy-MM');
  const { data: budgets = [], isLoading } = useBudgets(currentMonth);
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const expenseCategories = getExpenseCategories();

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      limit: 0,
      month: currentMonth,
    },
  });

  const handleSubmit = (data: BudgetFormValues) => {
    const budgetData: BudgetFormData = {
      category: data.category as TransactionCategory,
      limit: data.limit,
      month: data.month,
    };

    if (editingBudget) {
      updateBudget.mutate(
        { id: editingBudget.id, data: budgetData },
        {
          onSuccess: () => {
            setEditingBudget(null);
            form.reset();
          },
        }
      );
    } else {
      createBudget.mutate(budgetData, {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    form.reset({
      category: budget.category,
      limit: budget.limit,
      month: budget.month,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget.mutate(id);
    }
  };

  const BudgetForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Limit</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false);
              setEditingBudget(null);
              form.reset();
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createBudget.isPending || updateBudget.isPending}
            className="flex-1"
          >
            {(createBudget.isPending || updateBudget.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editingBudget ? 'Update' : 'Create'} Budget
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground mt-1">
              Set and track your monthly spending limits
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
              </DialogHeader>
              <BudgetForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Card */}
        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Monthly Overview</h2>
              <p className="text-muted-foreground">{format(new Date(), 'MMMM yyyy')}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-expense">{formatCurrency(totalSpent)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-bold text-income">
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{overallPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Budget Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-card border border-border/50">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No budgets yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first budget to start tracking your spending
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onClick={() => handleEdit(budget)}
              />
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={!!editingBudget}
          onOpenChange={(open) => {
            if (!open) {
              setEditingBudget(null);
              form.reset();
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Budgets;
