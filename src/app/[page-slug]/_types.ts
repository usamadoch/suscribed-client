import { SocialLink, User } from "@/lib/types";








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
    socialLinks: SocialLink[];
    theme: PageTheme;
    isPublic: boolean;
    status: 'draft' | 'published';
    memberCount: number;
    postCount: number;
    createdAt: string;
    updatedAt: string;
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
    socialLinks?: SocialLink[];
    theme?: PageTheme;
    isPublic?: boolean;
    status?: 'draft' | 'published';
}