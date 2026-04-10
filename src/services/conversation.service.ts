
import { fetchApi, API_BASE_URL, ApiClientError } from "./api.client";
import { 
    Conversation, 
    Pagination, 
    StartConversationPayload, 
    GetMessagesParams, 
    Message, 
    SendMessagePayload 
} from "@/types";

export const conversationService = {
    async getAll(params: { page?: number; limit?: number } = {}): Promise<{
        conversations: Conversation[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/conversations${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async start(payload: StartConversationPayload): Promise<{
        conversation: Conversation;
        isNew: boolean;
    }> {
        return fetchApi('/conversations', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getMessages(
        conversationId: string,
        params: GetMessagesParams = {}
    ): Promise<{ messages: Message[] } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/conversations/${conversationId}/messages${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async sendMessage(
        conversationId: string,
        payload: SendMessagePayload
    ): Promise<{ message: Message }> {
        return fetchApi(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async markAsRead(conversationId: string, messageId: string): Promise<{ message: Message }> {
        return fetchApi(`/conversations/${conversationId}/messages/${messageId}/read`, {
            method: 'PUT',
        });
    },

    async getUnreadCount(): Promise<{ count: number }> {
        return fetchApi('/conversations/unread-count');
    },
};
