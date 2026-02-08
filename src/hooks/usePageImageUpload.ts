
import { useState } from 'react';
import { pageApi, mediaApi } from '@/lib/api';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export type ImageType = 'banner' | 'avatar';

interface UsePageImageUploadProps {
    onUploadSuccess?: (type: ImageType, url: string) => void;
}

export const usePageImageUpload = ({ onUploadSuccess }: UsePageImageUploadProps = {}) => {
    const [uploadingType, setUploadingType] = useState<ImageType | null>(null);
    const [optimisticBanner, setOptimisticBanner] = useState<string | null>(null);
    const [optimisticAvatar, setOptimisticAvatar] = useState<string | null>(null);

    const uploadImage = async (file: File, type: ImageType) => {
        if (file.size > MAX_FILE_SIZE) {
            alert("File is too large. Max 5MB.");
            return null;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            alert("Invalid file type. Only JPG, PNG, and GIF are allowed.");
            return null;
        }

        setUploadingType(type);
        try {
            // 1. Get signature from backend
            // We use user-level types: 'banner' or 'avatar'
            const signatureData = await mediaApi.getCloudinarySignature(type);

            // 2. Prepare FormData for Cloudinary
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

            // 3. Upload directly to Cloudinary
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
            const imageUrl = data.secure_url;

            // 4. Update backend with new URL
            if (imageUrl) {
                // Apply cache busting for immediate update
                const newUrl = `${imageUrl}`; // Cloudinary URLs are usually stable, maybe add timestamp if needed for react re-renders but usually not needed if URL changes. 
                // Actually, if we overwrite, URL might be same. But here we get a new public_id usually unless we force same name.
                // Let's assume new URL for now.

                if (type === 'banner') setOptimisticBanner(newUrl);
                else setOptimisticAvatar(newUrl);

                const payload = type === 'banner'
                    ? { bannerUrl: imageUrl }
                    : { avatarUrl: imageUrl };

                await pageApi.updateMyPage(payload);

                if (onUploadSuccess) {
                    onUploadSuccess(type, imageUrl);
                }

                return newUrl;
            }
        } catch (error) {
            console.error(`Failed to upload ${type}`, error);
            alert(`Failed to upload ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploadingType(null);
        }
        return null;
    };

    return {
        isUploading: !!uploadingType,
        uploadingType,
        optimisticBanner,
        optimisticAvatar,
        uploadImage
    };
};
