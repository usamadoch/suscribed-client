
import { fetchApi, API_BASE_URL, ApiClientError } from "./api.client";
import { Notification, Pagination } from "@/types";

interface GetNotificationsParams {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export const notificationService = {
    async getAll(params: GetNotificationsParams = {}): Promise<{
        notifications: Notification[];
        unreadCount: number;
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', String(params.page));
        if (params.limit) searchParams.set('limit', String(params.limit));
        if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
        const query = searchParams.toString();

        const response = await fetch(`${API_BASE_URL}/notifications${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new ApiClientError(
                { code: 'PARSE_ERROR', message: 'Invalid response from server' },
                response.status
            );
        }

        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getUnreadCount(): Promise<{ count: number }> {
        return fetchApi('/notifications/unread-count');
    },

    async markAsRead(id: string): Promise<{ notification: Notification }> {
        return fetchApi(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },

    async markAllAsRead(): Promise<{ message: string }> {
        return fetchApi('/notifications/read-all', {
            method: 'PUT',
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return fetchApi(`/notifications/${id}`, {
            method: 'DELETE',
        });
    },
};
