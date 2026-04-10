
import { fetchApi, API_BASE_URL, ApiClientError } from "./api.client";
import { 
    Member, 
    Pagination, 
    JoinMembershipPayload, 
    Tier, 
    Subscription 
} from "@/types";

export const membershipService = {
    async getMyMemberships(params: { page?: number; limit?: number } = {}): Promise<{
        members: Member[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/members${query ? `?${query}` : ''}`, {
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

    async getMyMembers(params: { page?: number; limit?: number } = {}): Promise<{
        members: Member[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/members/my-members${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );

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

    async join(payload: JoinMembershipPayload): Promise<{ member: Member }> {
        return fetchApi('/members', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async cancel(id: string): Promise<{ message: string }> {
        return fetchApi(`/members/${id}`, {
            method: 'DELETE',
        });
    },

    async checkMembership(pageId: string): Promise<{ isMember: boolean; member?: Member }> {
        return fetchApi(`/members/check/${pageId}`);
    },

    // Tier/Plan related
    async createPlan(payload: Partial<Tier>): Promise<Tier> {
        return fetchApi('/tiers', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getMyPlans(): Promise<{ plans: Tier[] }> {
        return fetchApi('/tiers/me');
    },

    async getCreatorPlans(creatorId: string): Promise<{ plans: Tier[] }> {
        return fetchApi(`/tiers/creator/${creatorId}`);
    },

    async updatePlan(id: string, payload: Partial<Tier>): Promise<Tier> {
        return fetchApi(`/tiers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    async updatePlanPrice(id: string, price: number): Promise<Tier> {
        return fetchApi(`/tiers/${id}/price`, {
            method: 'PUT',
            body: JSON.stringify({ price }),
        });
    },

    async subscribeToPlan(tierId: string, interval: 'MONTHLY' | 'YEARLY' = 'MONTHLY'): Promise<{ checkoutUrl?: string; trackerToken?: string; authToken?: string }> {
        return fetchApi<{ checkoutUrl?: string; trackerToken?: string; authToken?: string }>(`/tiers/${tierId}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({ interval }),
        });
    },

    async confirmSubscription(tierId: string, tracker?: string): Promise<Subscription> {
        const query = tracker ? `?tracker=${tracker}` : "";
        return fetchApi(`/tiers/${tierId}/confirm${query}`, {
            method: 'POST',
        });
    },

    async getSubscriptionStatus(tracker: string): Promise<{ status: string; tracker: string }> {
        return fetchApi(`/subscription/status?tracker=${tracker}`);
    },
};
