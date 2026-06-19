export interface YouTubeMessage {
    id: string;
    source: 'youtube';
    authorName: string;
    authorAvatar?: string;
    text: string;
    timestamp: Date;
    type: 'chat';
}

export interface CommonsMessage {
    id: string;
    source: 'commons';
    senderName: string;
    senderAvatar?: string;
    message: string;
    amountPKR: number;
    tier: number;
    bgColor: string;
    headerColor: string;
    textColor: string;
    isPinned: boolean;
    isHearted: boolean;
    timestamp: Date;
    type: 'paid' | 'free';
}

export type LiveMessage = YouTubeMessage | CommonsMessage;
