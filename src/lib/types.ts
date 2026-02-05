

export type SocialPlatform = 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'discord' | 'website' | 'facebook' | 'linkedin' | 'pinterest' | 'x' | 'other';

export interface SocialLink {
    platform: SocialPlatform;
    url: string;
    label?: string;
}

export type UserRole = 'member' | 'creator' | 'admin';

export interface NotificationPreferences {
    email: {
        newMembers: boolean;
        newComments: boolean;
        newMessages: boolean;
        weeklyDigest: boolean;
    };
    push: {
        newMembers: boolean;
        newPosts: boolean;
        newComments: boolean;
        newMessages: boolean;
        mentions: boolean;
    };
    inApp: {
        all: boolean;
    };
    quietHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
        timezone: string;
    };
}

export interface User {
    _id: string;
    email: string;
    role: UserRole;
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    googleId?: string;
    notificationPreferences: NotificationPreferences;
}

// ====================
// MEDIA TYPES
// ====================

export interface BaseMediaAttachment {
    url: string;
    filename: string;
    fileSize: number;
    mimeType: string;
    dimensions?: { width: number; height: number };
    _id?: string; // Often returned by DB
}

export interface ImageAttachment extends BaseMediaAttachment {
    type: 'image';
}

export interface VideoAttachment extends BaseMediaAttachment {
    type: 'video';
    thumbnailUrl: string;
    duration: number;
}

export type MediaAttachment = ImageAttachment | VideoAttachment;

// ====================
// POST TYPES
// ====================

export type PostType = 'text' | 'image' | 'video';
export type PostStatus = 'draft' | 'scheduled' | 'published';
export type PostVisibility = 'public' | 'members';

export interface Post {
    _id: string;
    creatorId: string;
    pageId: string;
    caption: string;
    mediaAttachments: MediaAttachment[];
    postType: PostType;
    tags: string[];
    visibility: PostVisibility;
    status: PostStatus;
    publishedAt: string | null;
    scheduledFor: string | null;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    allowComments: boolean;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
    // Client specific
    isLiked?: boolean; // Often added by aggregating queries
}


// ====================
// API RESPONSE TYPES
// ====================

export interface Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface SuccessResponse<T> {
    success: true;
    data: T;
    meta?: {
        pagination?: Pagination;
        [key: string]: unknown;
    };
}

export interface ErrorResponse {
    success: false;
    error: ApiError;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
