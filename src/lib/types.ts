
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
    | 'subscriptions:view' // viewing own memberships
    | 'security:manage'
    | 'admin:access';

export type TimeRange = 7 | 30 | 90;



export type SocialPlatform = 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'discord' | 'website' | 'facebook' | 'linkedin' | 'pinterest' | 'x' | 'other';

export interface SocialLink {
    platform: SocialPlatform;
    url: string;
    label?: string; // Optional: User-defined display name for the link
}

export type UserRole = 'member' | 'creator' | 'admin';

// Onboarding step: strict literal union representing each stage of creator onboarding.
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
    googleId?: string; // Optional: Only present if user signed up/linked via Google
    onboardingStep: OnboardingStep;
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
    _id?: string; // Optional: Present when returned from DB, absent during upload
}

export type MediaStatus = 'preparing' | 'ready' | 'errored';

export interface ImageAttachment extends BaseMediaAttachment {
    type: 'image';
    cloudinaryPublicId?: string;
    thumbnailUrl?: string;                // Optional: Preview thumbnail
    dimensions: { width: number; height: number };
}

export interface VideoAttachment extends BaseMediaAttachment {
    type: 'video';
    muxUploadId?: string;
    muxAssetId?: string;
    muxPlaybackId?: string;
    status?: MediaStatus;
    thumbnailUrl: string;
    duration: number;
    dimensions: { width: number; height: number };
}

export type MediaAttachment = ImageAttachment | VideoAttachment;

// ====================
// COMMENT TYPES
// ====================

export interface Comment {
    _id: string;
    postId: string;
    authorId: string | User;
    content: string;
    createdAt: string;
    updatedAt: string;
}

// ====================
// POST TYPES
// ====================

export type PostStatus = 'draft' | 'scheduled' | 'published';
export type PostVisibility = 'public' | 'members';

// Common fields for all posts
interface BasePostFields {
    _id: string;
    creatorId: string | Pick<User, '_id' | 'displayName' | 'username' | 'avatarUrl'>;
    pageId: string | Pick<CreatorPage, '_id' | 'pageSlug' | 'displayName' | 'avatarUrl'>;
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
    isLocked: boolean;
    // Client specific
    isLiked?: boolean;
}

// Invariants for Locked vs Unlocked posts
type LockedPostState = {
    isLocked: true;
    teaser: string;      // Locked posts must have a teaser (or at least undefined is not enough, domain usually implies content replacement)
    caption: null;       // Locked posts hide caption
}

type UnlockedPostState = {
    isLocked: false;
    teaser?: null;       // Unlocked posts don't use teaser
    caption: string | null;
}

type BasePost = BasePostFields & (LockedPostState | UnlockedPostState);

/**
 * Locked media attachment - returned when user doesn't have access
 * url is null, only thumbnailUrl (blurred preview) is available
 */
export interface LockedImageAttachment {
    type: 'image';
    url: null;
    thumbnailUrl?: string;               // Blurred preview URL
    filename: string;
    fileSize: number;
    mimeType: string;
    dimensions?: { width: number; height: number };
}

export interface LockedVideoAttachment {
    type: 'video';
    url: null;
    thumbnailUrl?: string;               // Blurred preview URL
    filename: string;
    fileSize: number;
    mimeType: string;
    dimensions?: { width: number; height: number };
    muxPlaybackId: null;
    muxAssetId: null;
    duration?: number;
    status?: MediaStatus;
}

export type LockedMediaAttachment = LockedImageAttachment | LockedVideoAttachment;

/**
 * Union type that represents any media attachment (locked or unlocked)
 */
export type AnyMediaAttachment = MediaAttachment | LockedMediaAttachment;

export type TextPost = BasePost & {
    postType: 'text';
    mediaAttachments: never[];
}

export type ImagePost = BasePost & {
    postType: 'image';
    mediaAttachments: (ImageAttachment | LockedImageAttachment)[];
}

export type VideoPost = BasePost & {
    postType: 'video';
    mediaAttachments: (VideoAttachment | LockedVideoAttachment)[];
}

export type Post = TextPost | ImagePost | VideoPost;

/**
 * Type guard to check if a post is locked
 */
export function isLockedPost(post: Post): boolean {
    return post.isLocked === true;
}

/**
 * Type guard to check if a media attachment is locked (url is null)
 */
export function isLockedMedia(
    attachment: MediaAttachment | LockedMediaAttachment
): attachment is LockedMediaAttachment {
    return attachment.url === null;
}

/**
 * Type guard to check if a media attachment is unlocked (has url)
 */
export function isUnlockedMedia(
    attachment: MediaAttachment | LockedMediaAttachment
): attachment is MediaAttachment {
    return attachment.url !== null;
}

/**
 * Helper to get unlocked media attachments from a post.
 * Use this when you know the post should be unlocked (e.g., in editing contexts).
 * Returns an empty array if the post is locked.
 */
export function getUnlockedMediaAttachments(post: Post): MediaAttachment[] {
    if (post.isLocked) return [];
    if (post.postType === 'text') return [];

    // Filter to only unlocked media (which should be all of them if !isLocked)
    return post.mediaAttachments.filter(isUnlockedMedia);
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
    cursor?: string;
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



export interface UploadedFile {
    url: string;
    filename: string;
    fileSize: number;
    mimeType: string;
}


// ====================
// AUTH RELATED TYPES
// ====================

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

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}


// ====================
// API PAYLOAD TYPES
// ====================

export type PostType = Post['postType'];
export type CreatePostPayload =
    | { _id?: string; postType: 'text'; caption: string; mediaAttachments?: never; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; }
    | { _id?: string; postType: 'image'; caption?: string; mediaAttachments: ImageAttachment[]; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; }
    | { _id?: string; postType: 'video'; caption?: string; mediaAttachments: VideoAttachment[]; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; };

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface UpdateUserPayload {
    displayName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    specifications?: string[];
    notificationPreferences?: Partial<NotificationPreferences>;
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

export interface JoinMembershipPayload {
    creatorId: string;
    pageId: string;
}

export interface StartConversationPayload {
    recipientId: string;
}

export interface SendMessagePayload {
    content: string;
    contentType?: 'text' | 'image' | 'file';
}

export interface CreateCommentPayload {
    content: string;
    parentId?: string;
}


// ====================
// PAGE RELATED TYPES
// ====================

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


// ====================
// MEMBERSHIP RELATED TYPES
// ====================

export type MembershipStatus = 'active' | 'paused' | 'cancelled';

export interface Membership {
    _id: string;
    memberId: string | User;
    creatorId: string | User;
    pageId: string | CreatorPage;
    status: MembershipStatus;
    tier?: string;
    joinedAt: string;
    cancelledAt: string | null;
    updatedAt: string;
}

export interface JoinMembershipPayload {
    creatorId: string;
    pageId: string;
}




// Notification
export type NotificationType =
    | 'new_member' | 'member_left' | 'new_post' | 'post_liked' | 'new_like'
    | 'new_comment' | 'comment_reply' | 'new_message' | 'mention'
    | 'creator_went_live' | 'membership_expired' | 'system';

export interface Notification {
    _id: string;
    recipientId: string;
    type: NotificationType;
    title: string;
    body: string;
    message?: string;
    imageUrl: string | null;
    actionUrl: string;
    actionLabel: string;
    relatedId?: string;
    metadata?: Record<string, any>; // Added for richer context
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
}






// Conversation & Message
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageAttachment {
    type: 'image' | 'file';
    url: string;
    filename: string;
    fileSize: number;
    mimeType: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: string | User;
    content: string;
    contentType: 'text' | 'image' | 'file';
    attachments: MessageAttachment[];
    status: MessageStatus;
    isRead?: boolean;
    readAt: string | null;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: (string | User)[];
    creatorId: string | User;
    memberId: string | User;
    isActive: boolean;
    lastMessage: {
        content: string;
        senderId: string;
        sentAt: string;
    } | null;
    unreadCounts: Record<string, number>;
    createdAt: string;
    updatedAt?: string;
}

export interface GetMessagesParams {
    page?: number;
    limit?: number;
    cursor?: string;
}