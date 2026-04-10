import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { membershipService } from "@/services/membership.service";
import { useAuth } from "@/store/auth";

// Hook to fetch Members of the Creator's Page
export const useMyMembers = (params: { page: number; limit: number }) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-members', params, user?._id],
        queryFn: async () => {
            return await membershipService.getMyMembers(params);
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 1,
        placeholderData: keepPreviousData,
    });
};

// Hook to join a page
export const useJoinPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ creatorId, pageId }: { creatorId: string; pageId: string }) => {
            return await membershipService.join({ creatorId, pageId });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['check-member', variables.pageId] });
            queryClient.invalidateQueries({ queryKey: ['my-members'] });
            queryClient.invalidateQueries({ queryKey: ['post', variables.pageId] });
        },
    });
};

// Hook to check member status
export const useCheckMembership = (pageId: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['check-member', pageId, user?._id],
        queryFn: async () => {
            if (!pageId || !user) return { isMember: false };
            return await membershipService.checkMembership(pageId);
        },
        enabled: !!pageId && !!user,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook to fetch Creator Plans
export const useCreatorPlans = (creatorId?: string) => {
    return useQuery({
        queryKey: ['creator-plans', creatorId],
        queryFn: async () => {
            if (!creatorId) return [];
            const { plans } = await membershipService.getCreatorPlans(creatorId);
            return plans;
        },
        enabled: !!creatorId,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for User Memberships (List of pages I joined)
export const useMyMemberships = (enabled: boolean = true) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-members', user?._id],
        queryFn: async () => {
            const { members } = await membershipService.getMyMemberships({ limit: 100 });
            return members || [];
        },
        enabled: !!user && enabled,
        staleTime: 1000 * 60 * 15,
    });
};
