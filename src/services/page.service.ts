
import { fetchApi } from "./api.client";
import { ExploreCreator, CreatorPage, UpdatePagePayload } from "@/types";

export const pageService = {
    async getAll(): Promise<{ pages: ExploreCreator[] }> {
        return fetchApi('/pages');
    },

    async getBySlug(slug: string): Promise<{
        page: CreatorPage;
        isOwner: boolean;
        isMember: boolean;
        isRestricted: boolean;
    }> {
        return fetchApi(`/pages/${encodeURIComponent(slug)}`);
    },

    async getMyPage(): Promise<{ page: CreatorPage }> {
        return fetchApi('/pages/my/page');
    },

    async updateMyPage(payload: UpdatePagePayload): Promise<{ page: CreatorPage }> {
        return fetchApi('/pages/my/page', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },
};
