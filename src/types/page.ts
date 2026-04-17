
import { User } from './user';

export interface PageTheme {
    primaryColor: string;
    accentColor: string;
    layout: 'default' | 'minimal' | 'featured';
}

export interface CreatorPage {
    _id: string;
    userId: string | User;
    pageSlug: string;
    displayName: string;
    tagline: string;
    category: string[];
    avatarUrl: string | null;
    bannerUrl: string | null;
    about: string;
    theme: PageTheme;
    isPublic: boolean;
    status: 'draft' | 'published';
    memberCount: number;
    postCount: number;
    youtube?: {
        channelId: string;
        channelName: string;
        thumbnail?: string;
        isVerified: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ExploreCreator {
    _id: string;
    pageSlug: string;
    displayName: string;
    tagline: string;
    avatarUrl: string | null;
    memberCount: number;
    postCount: number;
}

export interface UpdatePagePayload {
    displayName?: string;
    tagline?: string;
    pageSlug?: string;
    specifications?: string[];
    category?: string[];
    about?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    theme?: PageTheme;
    isPublic?: boolean;
    status?: 'draft' | 'published';
}
