import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const useAdminPayouts = () => {
    const queryClient = useQueryClient();

    const { data: payouts = [], isLoading, error } = useQuery({
        queryKey: ['admin-payouts'],
        queryFn: async () => {
            const res = await adminApi.getPendingPayouts();
            return res.payouts;
        },
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ id, status, rejectionReason }: { id: string, status: 'approved' | 'rejected', rejectionReason?: string }) => {
            const res = await adminApi.reviewPayout(id, { status, rejectionReason });
            return res;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
            toast.success(`Payout ${variables.status} successfully`);
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to review payout');
        }
    });

    return {
        payouts,
        isLoading,
        error,
        reviewPayout: reviewMutation.mutate,
        isReviewing: reviewMutation.isPending
    };
};
