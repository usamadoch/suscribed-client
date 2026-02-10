import {
    ApiError,
    ApiResponse,
    User,
    SignupPayload,
    LoginPayload,
    ChangePasswordPayload,
    CreatorPage,
    UpdatePagePayload,
    Pagination,
    Membership,
    JoinMembershipPayload,
    UploadedFile,
    Post,
    Comment,
    CreatePostPayload,
    UpdatePostPayload,
    CreateCommentPayload,
    UpdateUserPayload,
    Conversation,
    StartConversationPayload,
    Message,
    SendMessagePayload,
    Notification
} from "./types";









// API base URL - Hardcoded for debugging as requested
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class for API errors
export class ApiClientError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: Record<string, string[]>;

    constructor(error: ApiError, status: number) {
        super(error.message);
        this.name = 'ApiClientError';
        this.code = error.code;
        this.status = status;
        this.details = error.details;
    }
}

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Core fetch wrapper with error handling and auto-refresh
 */
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // Always send cookies
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (options.body instanceof FormData) {
        delete (config.headers as Record<string, string>)['Content-Type'];
    }

    let response: Response;

    try {
        response = await fetch(url, config);
    } catch (error) {
        // Network error (server unreachable, CORS blocked, etc.)
        console.error('[API] Network error:', error);
        throw new ApiClientError(
            { code: 'NETWORK_ERROR', message: 'Unable to connect to server' },
            0
        );
    }

    // Handle 401 - try to refresh token (but not for auth endpoints)
    // Endpoints that should NOT trigger a token refresh on 401
    const NO_REFRESH_ENDPOINTS = [
        '/auth/login',
        '/auth/signup',
        '/auth/check-email',
        '/auth/google',
        '/auth/refresh'
    ];

    const skipRefresh = NO_REFRESH_ENDPOINTS.some(path => endpoint.startsWith(path));
    if (response.status === 401 && !skipRefresh) {
        const refreshed = await refreshTokens();
        if (refreshed) {
            // Retry original request
            try {
                response = await fetch(url, config);
            } catch (error) {
                console.error('[API] Network error on retry:', error);
                throw new ApiClientError(
                    { code: 'NETWORK_ERROR', message: 'Unable to connect to server' },
                    0
                );
            }
        }
    }

    let data: ApiResponse<T>;
    try {
        data = await response.json() as ApiResponse<T>;
    } catch {
        // Response is not valid JSON
        throw new ApiClientError(
            { code: 'PARSE_ERROR', message: 'Invalid response from server' },
            response.status
        );
    }

    if (!data.success) {
        throw new ApiClientError(data.error, response.status);
    }

    return data.data;
}

/**
 * Refresh access token using refresh token
 */
async function refreshTokens(): Promise<boolean> {
    // If already refreshing, wait for the existing promise
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            return response.ok;
        } catch {
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}


// ====================
// AUTH API
// ====================

export const authApi = {
    async signup(payload: SignupPayload): Promise<{ user: User }> {
        return fetchApi('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(payload: LoginPayload): Promise<{ user: User }> {
        return fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async googleLogin(code: string, role?: string): Promise<{ user: User; isNewUser: boolean }> {
        return fetchApi('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ code, role }),
        });
    },

    async checkEmail(email: string): Promise<{ exists: boolean }> {
        return fetchApi('/auth/check-email', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async logout(): Promise<{ message: string }> {
        return fetchApi('/auth/logout', {
            method: 'POST',
        });
    },

    async getMe(): Promise<{ user: User }> {
        return fetchApi('/auth/me');
    },

    async refresh(): Promise<{ message: string }> {
        return fetchApi('/auth/refresh', {
            method: 'POST',
        });
    },

    async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
        return fetchApi('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};


// ====================
// PAGE API
// ====================

export const pageApi = {
    async getAll(): Promise<{ pages: CreatorPage[] }> {
        return fetchApi('/pages');
    },

    async getBySlug(slug: string): Promise<{
        page: CreatorPage;
        isOwner: boolean;
        isMember: boolean;
        isRestricted: boolean;
    }> {
        return fetchApi(`/pages/${encodeURIComponent(slug)}`);
    },

    async getMyPage(): Promise<{ page: CreatorPage }> {
        return fetchApi('/pages/my/page');
    },

    async updateMyPage(payload: UpdatePagePayload): Promise<{ page: CreatorPage }> {
        return fetchApi('/pages/my/page', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },
};


// ====================
// MEMBERSHIP API
// ====================

interface GetMembershipsParams {
    page?: number;
    limit?: number;
}

export const membershipApi = {
    async getMyMemberships(params: GetMembershipsParams = {}): Promise<{
        memberships: Membership[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/memberships${query ? `?${query}` : ''}`, {
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
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getMyMembers(params: GetMembershipsParams = {}): Promise<{
        memberships: Membership[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/memberships/my-members${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );

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
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async join(payload: JoinMembershipPayload): Promise<{ membership: Membership }> {
        return fetchApi('/memberships', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async cancel(id: string): Promise<{ message: string }> {
        return fetchApi(`/memberships/${id}`, {
            method: 'DELETE',
        });
    },

    async checkMembership(pageId: string): Promise<{ isMember: boolean; membership?: Membership }> {
        return fetchApi(`/memberships/check/${pageId}`);
    },
};






// ====================
// MEDIA API (NEW)
// ====================

export const mediaApi = {
    async getCloudinarySignature(type: string, refId?: string): Promise<{
        timestamp: number;
        signature: string;
        apiKey: string;
        cloudName: string;
        folder?: string;
        public_id?: string;
    }> {
        // Build query string
        const searchParams = new URLSearchParams();
        searchParams.set('type', type);
        if (refId) searchParams.set('refId', refId);

        const query = searchParams.toString();
        return fetchApi(`/media/cloudinary/signature?${query}`);
    },

    async getMuxUploadUrl(refId?: string): Promise<{
        url: string;
        uploadId: string;
    }> {
        const query = refId ? `?refId=${refId}` : '';
        return fetchApi(`/media/mux/upload-url${query}`);
    },

    async deleteMedia(type: 'image' | 'video', id: string): Promise<{ message: string }> {
        return fetchApi(`/media/${type}/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
    },
};


// ====================
// POST API
// ====================



interface GetPostsParams {
    creatorId?: string;
    pageSlug?: string;
    status?: string;
    visibility?: string;
    page?: number;
    limit?: number;
}

export const postApi = {
    async getAll(params: GetPostsParams = {}): Promise<{ posts: Post[] } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/posts${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getById(id: string): Promise<{ post: Post; isLiked: boolean }> {
        return fetchApi(`/posts/${id}`);
    },

    async getByPage(pageId: string): Promise<{ posts: Post[] }> {
        return fetchApi(`/pages/${pageId}/posts`);
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

    async toggleLike(id: string): Promise<{ liked: boolean }> {
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
};





// ====================
// NOTIFICATION API
// ====================




interface GetNotificationsParams {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export const notificationApi = {
    async getAll(params: GetNotificationsParams = {}): Promise<{
        notifications: Notification[];
        unreadCount: number;
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', String(params.page));
        if (params.limit) searchParams.set('limit', String(params.limit));
        if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
        const query = searchParams.toString();

        const response = await fetch(`${API_BASE_URL}/notifications${query ? `?${query}` : ''}`, {
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
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getUnreadCount(): Promise<{ count: number }> {
        return fetchApi('/notifications/unread-count');
    },

    async markAsRead(id: string): Promise<{ notification: Notification }> {
        return fetchApi(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },

    async markAllAsRead(): Promise<{ message: string }> {
        return fetchApi('/notifications/read-all', {
            method: 'PUT',
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return fetchApi(`/notifications/${id}`, {
            method: 'DELETE',
        });
    },
};






// ====================
// USER API
// ====================



export const userApi = {
    async getByUsername(username: string): Promise<{ user: User; page: CreatorPage | null }> {
        return fetchApi(`/users/${encodeURIComponent(username)}`);
    },

    async getById(id: string): Promise<{ user: User; page: CreatorPage | null }> {
        return fetchApi(`/users/id/${id}`);
    },

    async updateMe(payload: UpdateUserPayload): Promise<{ user: User }> {
        return fetchApi('/users/me', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },
};




// ====================
// CONVERSATION API
// ====================

interface GetConversationsParams {
    page?: number;
    limit?: number;
}

interface GetMessagesParams {
    page?: number;
    limit?: number;
}

export const conversationApi = {
    async getAll(params: GetConversationsParams = {}): Promise<{
        conversations: Conversation[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/conversations${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async start(payload: StartConversationPayload): Promise<{
        conversation: Conversation;
        isNew: boolean;
    }> {
        return fetchApi('/conversations', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getMessages(
        conversationId: string,
        params: GetMessagesParams = {}
    ): Promise<{ messages: Message[] } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/conversations/${conversationId}/messages${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async sendMessage(
        conversationId: string,
        payload: SendMessagePayload
    ): Promise<{ message: Message }> {
        return fetchApi(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async markAsRead(conversationId: string, messageId: string): Promise<{ message: Message }> {
        return fetchApi(`/conversations/${conversationId}/messages/${messageId}/read`, {
            method: 'PUT',
        });
    },

    async getUnreadCount(): Promise<{ count: number }> {
        return fetchApi('/conversations/unread-count');
    },
};


// ====================
// ANALYTICS API
// ====================

export interface AnalyticsOverview {
    totalMembers: number;
    newMembers: number;
    memberGrowth: number;
    totalViews: number;
    viewGrowth: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    engagementRate: number;
}

export interface MemberGrowthData {
    _id: string; // Date string YYYY-MM-DD
    count: number;
}



export interface PostAnalytics {
    _id: string;
    title?: string;
    caption?: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishedAt: string | null;
    mediaAttachments?: {
        type: 'image' | 'video';
        url: string;
    }[];
}

export interface EngagementBreakdown {
    breakdown: {
        likes: number;
        comments: number;
        views: number;
    };
    percentages: {
        likes: number | string;
        comments: number | string;
    };
}

import { TimeRange } from "./types";

interface AnalyticsParams {
    days?: TimeRange;
}

export const analyticsApi = {
    async getOverview(params: AnalyticsParams = {}): Promise<AnalyticsOverview> {
        const searchParams = new URLSearchParams();
        if (params.days) searchParams.set('days', String(params.days));
        const query = searchParams.toString();
        return fetchApi(`/analytics/overview${query ? `?${query}` : ''}`);
    },

    async getMembers(params: AnalyticsParams = {}): Promise<{
        dailyGrowth: MemberGrowthData[];
    }> {
        const searchParams = new URLSearchParams();
        if (params.days) searchParams.set('days', String(params.days));
        const query = searchParams.toString();
        return fetchApi(`/analytics/members${query ? `?${query}` : ''}`);
    },

    async getPosts(): Promise<{
        topPosts: PostAnalytics[];
        recentPosts: PostAnalytics[];
    }> {
        return fetchApi('/analytics/posts');
    },

    async getEngagement(): Promise<EngagementBreakdown> {
        return fetchApi('/analytics/engagement');
    },
};
