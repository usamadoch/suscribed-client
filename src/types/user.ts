
export type UserRole = 'member' | 'creator' | 'admin';

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export type OnboardingStep = 0 | 1 | 2 | 3 | 4;

export const ONBOARDING_STEPS = {
    NOT_STARTED: 0 as const,
    ACCOUNT_CREATED: 1 as const,
    DETAILS_DONE: 2 as const,
    CATEGORY_DONE: 3 as const,
    COMPLETE: 4 as const,
};

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
    onboardingStep: OnboardingStep;
    notificationPreferences: NotificationPreferences;
}

export interface AuthUser {
    _id: string;
    email: string;
    role: UserRole;
    displayName: string;
    username: string;
    avatarUrl: string | null;
    onboardingStep: OnboardingStep;
}

export type Permission =
    | 'post:create'
    | 'post:read'
    | 'post:update'
    | 'post:delete'
    | 'dashboard:view'
    | 'analytics:view'
    | 'members:view'
    | 'payouts:view'
    | 'page:manage'
    | 'explore:view'
    | 'subscriptions:view'
    | 'security:manage'
    | 'admin:access';


export interface SignupPayload {
    email: string;
    password: string;
    displayName: string;
    username: string;
    role?: 'member' | 'creator';
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateUserPayload {
    displayName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    specifications?: string[];
    notificationPreferences?: Partial<NotificationPreferences>;
}
