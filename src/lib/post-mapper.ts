import { Post, CreatorPage, isLockedMedia, ReviewItem } from "@/types";
import { formatAppDate } from "./date";

/**
 * Safely extracts creator information from a post and optional page object.
 * Handles different population levels of post.pageId.
 */
export const getCreatorInfo = (post: Post, page?: CreatorPage) => {
    // If we have an explicit page object, use it.
    if (page) {
        return {
            displayName: page.displayName || "Creator",
            avatarUrl: page.avatarUrl || "/images/content/avatar-1.jpg",
            pageSlug: page.pageSlug
        };
    }

    // Try to get info from post.pageId if it's populated
    if (post.pageId && typeof post.pageId === 'object') {
        const pageObj = post.pageId as any; // Cast because of Pick type in types.ts
        return {
            displayName: pageObj.displayName || "Creator",
            avatarUrl: pageObj.avatarUrl || "/images/content/avatar-1.jpg",
            pageSlug: pageObj.pageSlug
        };
    }

    // Try to get info from post.creatorId if it's populated
    if (post.creatorId && typeof post.creatorId === 'object') {
        const creatorObj = post.creatorId as any;
        return {
            displayName: creatorObj.displayName || "Creator",
            avatarUrl: creatorObj.avatarUrl || "/images/content/avatar-1.jpg",
            pageSlug: "" // User object might not have pageSlug
        };
    }

    return {
        displayName: "Creator",
        avatarUrl: "/images/content/avatar-1.jpg",
        pageSlug: ""
    };
};

