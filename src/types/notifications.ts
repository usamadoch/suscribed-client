
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
    metadata?: Record<string, any>;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
}
