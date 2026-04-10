
export type TimeRange = 7 | 30 | 90;

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

export interface AnalyticsParams {
    days?: TimeRange;
}
