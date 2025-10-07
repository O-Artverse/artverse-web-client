import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentService from '@/services/payment.service';
import type { CreatePaymentDto } from '@/types/order.types';
import toast from 'react-hot-toast';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create payment');
    },
  });
};

export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentService.cancelPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Payment cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel payment');
    },
  });
};
