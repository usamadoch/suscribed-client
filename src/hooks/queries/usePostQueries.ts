import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { ApiClientError } from "@/services/api.client";
import { useAuth } from "@/store/auth";
import { PostType } from "@/types";

// Hook to fetch Creator Posts
export const useCreatorPosts = (slug: string, filters?: { type?: PostType | PostType[] }) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['creator-posts', slug, filters, user?._id],
        queryFn: async () => {
            if (!slug) return [];
            const { posts } = await postService.getCreatorPosts({ pageSlug: slug, limit: 100, ...filters });
            return posts;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 2,
        placeholderData: keepPreviousData,
        retry: (failureCount, error) => {
            if (error instanceof ApiClientError && error.code === 'NOT_PUBLISHED') {
                return false;
            }
            return failureCount < 3;
        },
    });
};

// Hook for Home Feed (infinite scrolling, cursor-based)
export const useHomeFeed = () => {
    const { user } = useAuth();
    return useInfiniteQuery({
        queryKey: ['home-feed', user?._id],
        queryFn: async ({ pageParam }) => {
            return await postService.getHomeFeed({ cursor: pageParam as string | undefined, limit: 10 });
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.hasNextPage && lastPage.meta.nextCursor) {
                return lastPage.meta.nextCursor;
            }
            return undefined;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 2,
    });
};

// Hook to fetch Posts (Paginated)
export const usePosts = (params: { page: number; limit: number }) => {
    return useQuery({
        queryKey: ['posts', params],
        queryFn: async () => {
            return await postService.getMyPosts(params);
        },
        staleTime: 1000 * 60 * 1,
        placeholderData: keepPreviousData,
    });
};

// Hook to fetch a single Post
export const usePost = (id: string) => {
    return useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            if (!id) return null;
            const data = await postService.getById(id);
            return { ...data.post, isLiked: data.isLiked };
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook to fetch Post Comments
export const usePostComments = (postId: string) => {
    return useQuery({
        queryKey: ['post-comments', postId],
        queryFn: async () => {
            if (!postId) return [];
            const data = await postService.getComments(postId, { limit: 100 });
            return data.comments;
        },
        enabled: !!postId,
        staleTime: 1000 * 60 * 1,
    });
};

// Hook to fetch Recent Videos for Sidebar
export const useRecentVideos = (pageSlug: string) => {
    return useQuery({
        queryKey: ['recent-videos', pageSlug],
        queryFn: async () => {
            if (!pageSlug) return [];
            const { posts } = await postService.getRecentVideos(pageSlug);
            return posts;
        },
        enabled: !!pageSlug,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook to delete a Post
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => {
            return await postService.delete(postId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });
        },
    });
};
