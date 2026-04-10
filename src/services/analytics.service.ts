
import { fetchApi } from "./api.client";
import { AnalyticsParams, AnalyticsOverview, MemberGrowthData, PostAnalytics, EngagementBreakdown } from "@/types";

export const analyticsService = {
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
