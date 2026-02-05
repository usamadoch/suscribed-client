
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { pageApi } from "./_api";


import { useAuth } from "@/app/(auth)/_store/auth";
import { membershipApi } from "../(protected)/members/_api";

// Hook to fetch Creator Page Data (Profile, Banner, etc.)
export const useCreatorPage = (slug: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['creator-page', slug, user?._id],
        queryFn: async () => {
            if (!slug) return null;
            const { page, isOwner, isMember } = await pageApi.getBySlug(slug);
            return { page, isOwner, isMember };
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 10, // 10 minutes cache for profile info
        refetchOnWindowFocus: false,
    });
};

// Hook to fetch Current User's Page (for Navigation)
export const useMyPage = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-creation-page', user?._id],
        queryFn: async () => {
            const res = await pageApi.getMyPage();
            return res?.page || null;
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 30, // 30 minutes
        retry: false,
    });
};

// Hook for Explore Page
export const useExploreCreators = () => {
    return useQuery({
        queryKey: ['explore-creators'],
        queryFn: async () => {
            const { pages } = await pageApi.getAll();
            return pages || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook to fetch Members of the Creator's Page
export const useMyMembers = (params: { page: number; limit: number }) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-members', params, user?._id],
        queryFn: async () => {
            return await membershipApi.getMyMembers(params);
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: keepPreviousData,
    });
};

// Hook to join a page
export const useJoinPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ creatorId, pageId }: { creatorId: string; pageId: string }) => {
            return await membershipApi.join({ creatorId, pageId });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['check-membership', variables.pageId] });
            queryClient.invalidateQueries({ queryKey: ['my-memberships'] });
            queryClient.invalidateQueries({ queryKey: ['post', variables.pageId] }); // Potentially helpful
        },
    });
};

// Hook to check membership status
export const useCheckMembership = (pageId: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['check-membership', pageId, user?._id],
        queryFn: async () => {
            if (!pageId || !user) return { isMember: false };
            return await membershipApi.checkMembership(pageId);
        },
        enabled: !!pageId && !!user,
        staleTime: 1000 * 60 * 5,
    });
};
