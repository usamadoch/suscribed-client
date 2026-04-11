import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type CreatorPage as CreatorPageType } from "@/types";

export const useCreatorPageCache = (slug: string, userId?: string) => {
    const queryClient = useQueryClient();

    const handleImageSuccess = useCallback((type: 'banner' | 'avatar', url: string) => {
        type PageData = { page: CreatorPageType; isOwner: boolean; isMember: boolean };
        queryClient.setQueryData(['creator-page', slug, userId], (old: PageData | undefined) => {
            if (!old || !old.page) return old;
            return {
                ...old,
                page: {
                    ...old.page,
                    [type === 'banner' ? 'bannerUrl' : 'avatarUrl']: url
                }
            };
        });
    }, [queryClient, slug, userId]);

    const handleJoinSuccess = useCallback(() => {
        type PageData = { page: CreatorPageType; isOwner: boolean; isMember: boolean };
        queryClient.setQueryData(['creator-page', slug, userId], (old: PageData | undefined) => {
            if (!old) return old;
            return {
                ...old,
                isMember: true,
                page: {
                    ...old.page,
                    memberCount: (old.page.memberCount || 0) + 1
                }
            };
        });

        // Also invalidate posts to unlock content
        queryClient.invalidateQueries({ queryKey: ['creator-posts', slug] });
        queryClient.invalidateQueries({ queryKey: ['recent-videos', slug] });
    }, [queryClient, slug, userId]);

    return { handleImageSuccess, handleJoinSuccess };
};
