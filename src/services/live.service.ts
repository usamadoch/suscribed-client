import { fetchApi } from './api.client';
import { SuperChatTier } from '@/types';

export interface CreateLiveSessionPayload {
    title: string;
    youtubeVideoId: string;
    youtubeChannelId?: string | null;
    accessType: 'public' | 'members';
    paidMessagesEnabled: boolean;
    mergeYouTubeChat: boolean;
    notifyEmailOnLive: boolean;
    notifyPushOnLive: boolean;
}

export interface LiveSession {
    _id: string;
    creatorId: any;
    title: string;
    youtubeVideoId?: string;
    youtubeChannelId?: string | null;
    youtubeLiveChatId?: string;
    status: 'draft' | 'live' | 'ended';
    startedAt?: string;
    endedAt?: string;
    accessType: 'public' | 'members';
    paidMessagesEnabled: boolean;
    mergeYouTubeChat: boolean;
    notifyEmailOnLive: boolean;
    notifyPushOnLive: boolean;
    totalCollected: number;
    totalPaidMessages: number;
    peakViewerCount: number;
    createdAt: string;
    updatedAt: string;
    isLocked?: boolean;
}

export interface LiveSessionStats {
    collected: number;
    paidMsgs: number;
    watching: number;
    peakViewers?: number;
    status?: 'draft' | 'live' | 'ended';
    topSupporters: Array<{ rank: number; name: string; amount: string }>;
}

export interface ChatMessageResponse {
    id: string;
    source: 'commons';
    type: 'free';
    senderName: string;
    senderAvatar: string | null;
    message: string;
    amountPKR: number;
    tier: number;
    bgColor: string;
    headerColor: string;
    textColor: string;
    isPinned: boolean;
    isHearted: boolean;
    timestamp: string;
}

export const liveApi = {
    createSession: async (payload: CreateLiveSessionPayload) => {
        return fetchApi<LiveSession>('/live/sessions', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    listSessions: async () => {
        return fetchApi<LiveSession[]>('/live/sessions', {
            method: 'GET',
        });
    },
    deleteSession: async (sessionId: string) => {
        return fetchApi<{ success: boolean; message: string }>(`/live/sessions/${sessionId}`, {
            method: 'DELETE',
        });
    },
    getSession: async (sessionId: string) => {
        return fetchApi<LiveSession>(`/live/sessions/${sessionId}/control`, {
            method: 'GET',
        });
    },
    getSessionStats: async (sessionId: string) => {
        return fetchApi<LiveSessionStats>(`/live/sessions/${sessionId}/stats`, {
            method: 'GET',
        });
    },
    getPublicSession: async (sessionId: string) => {
        return fetchApi<LiveSession>(`/live/sessions/${sessionId}`, {
            method: 'GET',
        });
    },
    endSession: async (sessionId: string) => {
        return fetchApi<LiveSession>(`/live/sessions/${sessionId}/end`, {
            method: 'POST',
        });
    },
    sendChatMessage: async (sessionId: string, message: string) => {
        return fetchApi<ChatMessageResponse>(`/live/sessions/${sessionId}/chat`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    },
    deleteChatMessage: async (sessionId: string, msgId: string) => {
        return fetchApi<{ success: boolean }>(`/live/sessions/${sessionId}/chat/${msgId}`, {
            method: 'DELETE',
        });
    },
    timeoutUser: async (sessionId: string, userId: string, durationMinutes: number) => {
        return fetchApi<{ success: boolean; mutedUntil: string }>(`/live/sessions/${sessionId}/chat/timeout/${userId}`, {
            method: 'POST',
            body: JSON.stringify({ durationMinutes }),
        });
    },
    initiatePaidMessage: async (sessionId: string, payload: { amount: number, message: string }) => {
        return fetchApi<{ trackerToken: string, authToken: string, messageId: string }>(`/live/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    setupTracker: async (sessionId: string) => {
        return fetchApi<{ trackerToken: string, authToken: string }>(`/live/sessions/${sessionId}/setup-tracker`, {
            method: 'POST',
        });
    },
    chargeSavedCard: async (sessionId: string, messageId: string, paymentMethodToken?: string) => {
        return fetchApi(`/live/sessions/${sessionId}/messages/${messageId}/charge-saved`, {
            method: 'POST',
            body: paymentMethodToken ? JSON.stringify({ paymentMethodToken }) : undefined,
        });
    },
    confirmPaidMessage: async (sessionId: string, trackerToken: string) => {
        return fetchApi<{ success: true }>(`/live/sessions/${sessionId}/messages/confirm`, {
            method: 'POST',
            body: JSON.stringify({ trackerToken }),
        });
    },
    getSuperChatTiers: async () => {
        return fetchApi<SuperChatTier[]>(`/live/sessions/superchat-tiers`, {
            method: 'GET',
        });
    },
    getWalletStatus: async () => {
        return fetchApi<{ hasSavedCard: boolean, brand?: string, last4?: string, methods?: any[] }>(`/live/safepay/wallet-status`, {
            method: 'GET',
        });
    },
};
