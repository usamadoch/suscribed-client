import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payoutApi } from '@/lib/api';
import { PayoutMethod } from '@/lib/types';
import toast from 'react-hot-toast';

export const usePayoutMethod = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['payoutMethod'],
        queryFn: async () => {
            const res = await payoutApi.getMyPayoutMethod();
            return res;
        },
    });

    const submitMutation = useMutation({
        mutationFn: async (payload: Partial<PayoutMethod>) => {
            const res = await payoutApi.submitPayoutMethod(payload);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payoutMethod'] });
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to submit payout method');
        }
    });

    return {
        payoutMethod: data,
        isLoading,
        error,
        submitMethod: submitMutation.mutate,
        isSubmitting: submitMutation.isPending
    };
};

export const useEarningsSummary = () => {
    return useQuery({
        queryKey: ['earningsSummary'],
        queryFn: async () => {
            const res = await payoutApi.getEarningsSummary();
            return res;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
