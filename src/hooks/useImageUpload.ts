import { useState } from 'react';
import { mediaApi } from '@/lib/api';

interface UseImageUploadResult {
    uploadImage: (file: File, type: string, refId?: string) => Promise<string | null>;
    isUploading: boolean;
    error: string | null;
}

export const useImageUpload = (): UseImageUploadResult => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, type: string, refId?: string): Promise<string | null> => {
        setIsUploading(true);
        setError(null);
        try {
            // 1. Get signature
            const signatureData = await mediaApi.getCloudinarySignature(type, refId);

            // 2. Prepare FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signatureData.apiKey);
            formData.append('timestamp', signatureData.timestamp.toString());
            formData.append('signature', signatureData.signature);

            // IMPORTANT: If public_id is signed, it MUST be included in the upload
            if (signatureData.public_id) {
                formData.append('public_id', signatureData.public_id);
            }
            // Only append folder if we're NOT using public_id (folder is baked into public_id path)
            if (signatureData.folder && !signatureData.public_id) {
                formData.append('folder', signatureData.folder);
            }


            // 3. Upload to Cloudinary
            const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown upload error';
            console.error('Image upload failed:', err);
            setError(message);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading, error };
};
