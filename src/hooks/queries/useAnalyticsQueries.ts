import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/store/auth";
import { TimeRange } from "@/types";

// ======================
// ANALYTICS QUERIES
// ======================

// Hook to fetch Analytics Overview
export const useAnalyticsOverview = (days: TimeRange = 30) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['analytics-overview', days, user?._id],
        queryFn: async () => {
            return await analyticsService.getOverview({ days });
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

// Hook to fetch Member Analytics
export const useAnalyticsMembers = (days: TimeRange = 30) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['analytics-members', days, user?._id],
        queryFn: async () => {
            return await analyticsService.getMembers({ days });
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

// Hook to fetch Post Analytics
export const useAnalyticsPosts = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['analytics-posts', user?._id],
        queryFn: async () => {
            return await analyticsService.getPosts();
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

// Hook to fetch Engagement Analytics
export const useAnalyticsEngagement = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['analytics-engagement', user?._id],
        queryFn: async () => {
            return await analyticsService.getEngagement();
        },
        enabled: !!user && (user.role === 'creator' || user.role === 'admin'),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

// ======================
// USER PROFILE QUERIES
// ======================

// Hook to fetch full user profile (for settings pages)
export const useFullProfile = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['full-profile', user?._id],
        queryFn: async () => {
            const { user } = await authService.getFullProfile();
            return user;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 10,
    });
};
