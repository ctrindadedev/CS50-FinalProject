import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/budgetService';
import type { BudgetFormData } from '@/types';
import { toast } from '@/hooks/use-toast';

const BUDGETS_KEY = 'budgets';

export const useBudgets = (month?: string) => {
  return useQuery({
    queryKey: [BUDGETS_KEY, month],
    queryFn: () => budgetService.getAll(month),
    staleTime: 1000 * 60 * 5,
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: [BUDGETS_KEY, id],
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormData) => budgetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
      toast({
        title: 'Budget created',
        description: 'Your budget has been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create budget.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetFormData> }) =>
      budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
      toast({
        title: 'Budget updated',
        description: 'Your budget has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update budget.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
      toast({
        title: 'Budget deleted',
        description: 'Your budget has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete budget.',
        variant: 'destructive',
      });
    },
  });
};
