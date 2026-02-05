import { Pagination } from '@/lib/types';
import { JoinMembershipPayload, Membership } from './_types';
import { fetchApi, API_BASE_URL, ApiClientError } from '@/lib/api'

interface GetMembershipsParams {
    page?: number;
    limit?: number;
}

export const membershipApi = {
    async getMyMemberships(params: GetMembershipsParams = {}): Promise<{
        memberships: Membership[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/memberships${query ? `?${query}` : ''}`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async getMyMembers(params: GetMembershipsParams = {}): Promise<{
        memberships: Membership[];
    } & { pagination: Pagination }> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
        const query = searchParams.toString();
        const response = await fetch(
            `${API_BASE_URL}/memberships/my-members${query ? `?${query}` : ''}`,
            { credentials: 'include' }
        );
        const data = await response.json();
        if (!data.success) throw new ApiClientError(data.error, response.status);
        return { ...data.data, pagination: data.meta?.pagination };
    },

    async join(payload: JoinMembershipPayload): Promise<{ membership: Membership }> {
        return fetchApi('/memberships', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async cancel(id: string): Promise<{ message: string }> {
        return fetchApi(`/memberships/${id}`, {
            method: 'DELETE',
        });
    },

    async checkMembership(pageId: string): Promise<{ isMember: boolean; membership?: Membership }> {
        return fetchApi(`/memberships/check/${pageId}`);
    },
};
