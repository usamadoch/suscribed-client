
import { fetchApi } from "./api.client";

export const mediaService = {
    async getCloudinarySignature(type: string, refId?: string): Promise<{
        timestamp: number;
        signature: string;
        apiKey: string;
        cloudName: string;
        folder?: string;
        public_id?: string;
    }> {
        const searchParams = new URLSearchParams();
        searchParams.set('type', type);
        if (refId) searchParams.set('refId', refId);

        const query = searchParams.toString();
        return fetchApi(`/media/cloudinary/signature?${query}`);
    },

    async getMuxUploadUrl(refId?: string): Promise<{
        url: string;
        uploadId: string;
    }> {
        const query = refId ? `?refId=${refId}` : '';
        return fetchApi(`/media/mux/upload-url${query}`);
    },

    async deleteMedia(type: 'image' | 'video', id: string): Promise<{ message: string }> {
        return fetchApi(`/media/${type}/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
    },
};
