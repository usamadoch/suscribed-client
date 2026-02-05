






import { fetchApi } from "@/lib/api";
import { CreatorPage, UpdatePagePayload } from "./_types";




export const pageApi = {
    async getAll(): Promise<{ pages: CreatorPage[] }> {
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
