import { Post, CreatorPage, isLockedMedia, ReviewItem } from "./types";
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

/**
 * Maps a Post and optional Page object to a ReviewItem for consistent display.
 */
export const mapPostToReviewItem = (post: Post, page?: CreatorPage, isOwner: boolean = false): any => {
    const creator = getCreatorInfo(post, page);
    
    let content: string;
    let images: string[] = [];
    let video: { thumbnailUrl?: string; duration?: number } | undefined;

    if (post.isLocked) {
        content = post.teaser || 'Exclusive content for members';

        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => m.thumbnailUrl)
                .map(m => m.thumbnailUrl!)
                .filter((url): url is string => !!url);
        } else if (post.postType === 'video') {
             const attachment = post.mediaAttachments?.[0];
             if (attachment && attachment.thumbnailUrl) {
                 video = {
                     thumbnailUrl: attachment.thumbnailUrl,
                     duration: (attachment as any).duration
                 };
             }
        }
    } else {
        content = post.caption || '';
        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => !isLockedMedia(m) && m.url)
                .map(m => m.url)
                .filter((url): url is string => !!url);
        } else if (post.postType === 'video') {
            const attachment = post.mediaAttachments?.[0];
            if (attachment && !isLockedMedia(attachment) && attachment.url) {
                video = {
                    thumbnailUrl: attachment.thumbnailUrl,
                    duration: (attachment as any).duration
                };
            }
        }
    }

    return {
        id: post._id,
        author: creator.displayName,
        avatar: creator.avatarUrl,
        time: formatAppDate(post.createdAt, { suffix: true }),
        content: content,
        images: images,
        video: video,
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        isLiked: !!post.isLiked,
        isLocked: post.isLocked,
        shareUrl: `/post/${post._id}`,
        isOwner: isOwner,
    };
};
