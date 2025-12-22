import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import type { Transaction, TransactionFormData, TransactionFilter, TransactionSort } from '@/types';
import { toast } from '@/hooks/use-toast';

const TRANSACTIONS_KEY = 'transactions';

export const useTransactions = (filter?: TransactionFilter, sort?: TransactionSort) => {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, filter, sort],
    queryFn: () => transactionService.getAll(filter, sort),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormData) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      toast({
        title: 'Transaction created',
        description: 'Your transaction has been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create transaction.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionFormData> }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      toast({
        title: 'Transaction updated',
        description: 'Your transaction has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update transaction.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      toast({
        title: 'Transaction deleted',
        description: 'Your transaction has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete transaction.',
        variant: 'destructive',
      });
    },
  });
};
