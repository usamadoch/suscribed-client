import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipPlanApi } from '@/lib/api';
import { Tier } from '@/lib/types';
import toast from 'react-hot-toast';
import * as React from 'react';
import Alert from '@/components/Alert';

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
            toast.custom((t) => React.createElement(Alert, {
                type: 'success',
                message: 'Member plan created',
                onClose: () => toast.dismiss(t.id)
            }));
        },
        onError: (err: any) => {
            toast.custom((t) => React.createElement(Alert, {
                type: 'error',
                message: err.message || 'Failed to create plan',
                onClose: () => toast.dismiss(t.id)
            }));
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string, payload: Partial<Tier> }) => {
            const res = await membershipPlanApi.updatePlan(id, payload);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
            toast.custom((t) => React.createElement(Alert, {
                type: 'success',
                message: 'Member plan updated',
                onClose: () => toast.dismiss(t.id)
            }));
        },
        onError: (err: any) => {
            toast.custom((t) => React.createElement(Alert, {
                type: 'error',
                message: err.message || 'Failed to update plan',
                onClose: () => toast.dismiss(t.id)
            }));
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
