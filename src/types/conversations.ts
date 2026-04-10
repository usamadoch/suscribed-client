
import { User } from './user';

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
    isRead: boolean;
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

export interface StartConversationPayload {
    recipientId: string;
}

export interface SendMessagePayload {
    content: string;
    contentType?: 'text' | 'image' | 'file';
}
