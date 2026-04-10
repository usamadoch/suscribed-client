
import { fetchApi } from "./api.client";
import { User, CreatorPage, UpdateUserPayload } from "@/types";

export const userService = {
    async getByUsername(username: string): Promise<{ user: User; page: CreatorPage | null }> {
        return fetchApi(`/users/${encodeURIComponent(username)}`);
    },

    async getById(id: string): Promise<{ user: User; page: CreatorPage | null }> {
        return fetchApi(`/users/id/${id}`);
    },

    async updateMe(payload: UpdateUserPayload): Promise<{ user: User }> {
        return fetchApi('/users/me', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },
};
