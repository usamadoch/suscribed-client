
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



export type SocialPlatform = 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'discord' | 'website' | 'facebook' | 'linkedin' | 'pinterest' | 'x' | 'other';

export interface SocialLink {
    platform: SocialPlatform;
    url: string;
    label?: string; // Optional: User-defined display name for the link
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
    googleId?: string; // Optional: Only present if user signed up/linked via Google
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
// POST TYPES
// ====================

export type PostStatus = 'draft' | 'scheduled' | 'published';
export type PostVisibility = 'public' | 'members';

interface BasePost {
    _id: string;
    creatorId: string;
    pageId: string;
    caption: string;
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
    // Client specific
    isLiked?: boolean; // Optional: Injected by client-side aggregation
}

export interface TextPost extends BasePost {
    postType: 'text';
    mediaAttachments: never[];
}

export interface ImagePost extends BasePost {
    postType: 'image';
    mediaAttachments: ImageAttachment[];
}

export interface VideoPost extends BasePost {
    postType: 'video';
    mediaAttachments: VideoAttachment[];
}

export type Post = TextPost | ImagePost | VideoPost;


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
    | { postType: 'text'; caption: string; mediaAttachments?: never; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; }
    | { postType: 'image'; caption?: string; mediaAttachments: ImageAttachment[]; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; }
    | { postType: 'video'; caption?: string; mediaAttachments: VideoAttachment[]; visibility?: PostVisibility; tags?: string[]; allowComments?: boolean; status?: 'draft' | 'published'; scheduledFor?: string; };

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