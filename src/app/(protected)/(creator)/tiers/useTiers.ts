import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipPlanApi } from '@/lib/api';
import { Tier } from '@/lib/types';
import toast from 'react-hot-toast';

export const useTiers = () => {
    const queryClient = useQueryClient();

    const { data: plans = [], isLoading, error } = useQuery({
        queryKey: ['tiers'],
        queryFn: async () => {
            const res = await membershipPlanApi.getMyPlans();
            return res.plans;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (payload: Partial<Tier>) => {
            const res = await membershipPlanApi.createPlan(payload);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
            toast.success('Member plan created');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to create plan');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string, payload: Partial<Tier> }) => {
            const res = await membershipPlanApi.updatePlan(id, payload);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
            toast.success('Member plan updated');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to update plan');
        }
    });

    return {
        plans,
        isLoading,
        error,
        createPlan: createMutation.mutate,
        isCreating: createMutation.isPending,
        updatePlan: updateMutation.mutate,
        isUpdating: updateMutation.isPending
    };
};
