
import { fetchApi, API_BASE_URL, ApiClientError } from "./api.client";
import { 
    DashboardPost, 
    Pagination, 
    Post, 
    CreatePostPayload, 
    UpdatePostPayload, 
    Comment, 
    CreateCommentPayload 
} from "@/types";

export const postService = {
    async getMyPosts(params: { page?: number; limit?: number } = {}): Promise<{ posts: DashboardPost[] } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', String(params.page));
        if (params.limit) searchParams.set('limit', String(params.limit));
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/posts/my${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getCreatorPosts(params: { pageSlug: string; limit?: number; type?: string | string[] }): Promise<{ posts: Post[] }> {
        const searchParams = new URLSearchParams();
        searchParams.set('pageSlug', params.pageSlug);
        if (params.limit) searchParams.set('limit', String(params.limit));
        if (params.type) searchParams.set('type', String(params.type));
        const query = searchParams.toString();
        return fetchApi(`/posts/creator?${query}`);
    },

    async getById(id: string): Promise<{ post: Post; isLiked: boolean }> {
        return fetchApi(`/posts/${id}`);
    },

    async create(payload: CreatePostPayload): Promise<{ post: Post }> {
        return fetchApi('/posts', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async update(id: string, payload: UpdatePostPayload): Promise<{ post: Post }> {
        return fetchApi(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return fetchApi(`/posts/${id}`, {
            method: 'DELETE',
        });
    },

    async toggleLike(id: string): Promise<{ liked: boolean; likeCount: number }> {
        return fetchApi(`/posts/${id}/like`, {
            method: 'POST',
        });
    },

    async getComments(
        postId: string,
        params: { page?: number; limit?: number } = {}
    ): Promise<{ comments: Comment[] } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/posts/${postId}/comments${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async addComment(postId: string, payload: CreateCommentPayload): Promise<{ comment: Comment }> {
        return fetchApi(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getRecentVideos(pageSlug: string): Promise<{ posts: Post[] }> {
        return fetchApi(`/posts/recent-videos?pageSlug=${encodeURIComponent(pageSlug)}`);
    },

    async getHomeFeed(params: { cursor?: string; limit?: number } = {}): Promise<{
        posts: Post[];
        meta: { hasNextPage: boolean; nextCursor: string | null };
    }> {
        const searchParams = new URLSearchParams();
        if (params.cursor) searchParams.set('cursor', params.cursor);
        if (params.limit) searchParams.set('limit', String(params.limit));
        const query = searchParams.toString();

        const response = await fetch(`${API_BASE_URL}/posts/feed${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new ApiClientError(
                { code: 'PARSE_ERROR', message: 'Invalid response from server' },
                response.status
            );
        }

        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { posts: data.data.posts, meta: data.meta };
    },
};
