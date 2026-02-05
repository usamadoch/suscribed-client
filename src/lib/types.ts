

export interface SocialLink {
    platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'linkedin' | 'pinterest' | 'website';
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
    specifications?: string[];
    googleId?: string;
    notificationPreferences?: NotificationPreferences;
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
