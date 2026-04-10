import { useQuery } from "@tanstack/react-query";
import { pageService } from "@/services/page.service";
import { ApiClientError } from "@/services/api.client";
import { useAuth } from "@/store/auth";

// Hook to fetch Creator Page Data (Profile, Banner, etc.)
export const useCreatorPage = (slug?: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['creator-page', slug, user?._id],
        queryFn: async () => {
            if (!slug) return null;
            const { page, isOwner, isMember } = await pageService.getBySlug(slug);
            return { page, isOwner, isMember };
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (error instanceof ApiClientError && error.code === 'NOT_PUBLISHED') {
                return false;
            }
            return failureCount < 3;
        },
    });
};

// Hook to fetch Current User's Page (for Navigation)
export const useMyPage = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-creation-page', user?._id],
        queryFn: async () => {
            const res = await pageService.getMyPage();
            return res?.page || null;
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 30,
        retry: false,
    });
};

// Hook for Explore Page
export const useExploreCreators = () => {
    return useQuery({
        queryKey: ['explore-creators'],
        queryFn: async () => {
            const { pages } = await pageService.getAll();
            return pages || [];
        },
        staleTime: 1000 * 60 * 5,
    });
};
