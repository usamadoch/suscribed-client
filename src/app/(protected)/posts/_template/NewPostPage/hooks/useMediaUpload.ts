
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { getFullImageUrl } from "@/lib/utils";
import { MediaAttachment } from "@/lib/types";
import { postApi, mediaApi } from "@/lib/api";

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';

export type MediaFile = {
    id: string;
    url: string; // Local blob URL for preview
    type: "image" | "video";
    file?: File;
    isNew?: boolean;
    // Upload state tracking
    uploadStatus: UploadStatus;
    uploadProgress: number; // 0-100
    uploadedData?: MediaAttachment; // Result after upload  
    error?: string;
};

export const useMediaUpload = (draftId: string, initialAttachments?: MediaAttachment[]) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = useState<MediaFile[]>(() => {
        if (!initialAttachments) return [];
        return initialAttachments.map((m) => ({
            id: m.url || (m.type === 'video' && 'muxUploadId' in m ? m.muxUploadId : null) || Math.random().toString(36).substr(2, 9),
            url: getFullImageUrl(m.url) || "",
            type: m.type,
            isNew: false,
            uploadStatus: 'completed' as UploadStatus,
            uploadProgress: 100,
            uploadedData: m,
        }));
    });

    const initializedRef = useRef(false);

    // Sync attachments with initialAttachments when it loads (for edit mode)
    useEffect(() => {
        if (!initializedRef.current && initialAttachments && initialAttachments.length > 0) {
            // Check if we already have these attachments (avoid processing if state matched initial)
            // If attachments were initialized via useState lazy init, this might be redundant but safe.
            // But if useState init saw undefined, this will populate it.
            if (attachments.length === 0) {
                const mappedAttachments = initialAttachments.map((m) => ({
                    id: m.url || (m.type === 'video' && 'muxUploadId' in m ? m.muxUploadId : null) || Math.random().toString(36).substr(2, 9),
                    url: getFullImageUrl(m.url) || "",
                    type: m.type,
                    isNew: false,
                    uploadStatus: 'completed' as UploadStatus,
                    uploadProgress: 100,
                    uploadedData: m,
                }));
                setAttachments(mappedAttachments);
            }
            initializedRef.current = true;
        }
    }, [initialAttachments, attachments.length]);

    // Upload a single video to Mux
    const uploadVideoToMux = useCallback(async (mediaFile: MediaFile) => {
        if (!mediaFile.file) return;

        // Update status to uploading
        setAttachments(prev => prev.map(a =>
            a.id === mediaFile.id
                ? { ...a, uploadStatus: 'uploading' as UploadStatus, uploadProgress: 0 }
                : a
        ));

        try {
            const mediaApiResponse = await mediaApi.getMuxUploadUrl(draftId);
            const { url, uploadId } = mediaApiResponse;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', url, true);
                xhr.setRequestHeader('Content-Type', mediaFile.file!.type);
                xhr.timeout = 0;

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setAttachments(prev => prev.map(a =>
                            a.id === mediaFile.id ? { ...a, uploadProgress: percent } : a
                        ));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Network error'));
                xhr.ontimeout = () => reject(new Error('Timeout'));
                xhr.send(mediaFile.file);
            });

            // Success - store uploaded data
            const uploadedData: MediaAttachment = {
                type: 'video',
                url: '',
                filename: mediaFile.file.name,
                fileSize: mediaFile.file.size,
                mimeType: mediaFile.file.type,
                muxUploadId: uploadId,
                status: 'preparing',
                thumbnailUrl: '',
                duration: 0,
                dimensions: { width: 0, height: 0 }
            };

            setAttachments(prev => prev.map(a =>
                a.id === mediaFile.id
                    ? { ...a, uploadStatus: 'completed' as UploadStatus, uploadProgress: 100, uploadedData }
                    : a
            ));
        } catch (error) {
            setAttachments(prev => prev.map(a =>
                a.id === mediaFile.id
                    ? { ...a, uploadStatus: 'error' as UploadStatus, error: (error as Error).message }
                    : a
            ));
        }
    }, [draftId]);

    // Upload a single image to Cloudinary
    const uploadImageToCloudinary = useCallback(async (mediaFile: MediaFile) => {
        if (!mediaFile.file) return;

        setAttachments(prev => prev.map(a =>
            a.id === mediaFile.id
                ? { ...a, uploadStatus: 'uploading' as UploadStatus, uploadProgress: 0 }
                : a
        ));

        try {
            // Get full signature data including public_id
            const signatureData = await mediaApi.getCloudinarySignature('post_img', draftId);
            const { timestamp, signature, apiKey, cloudName, folder, public_id } = signatureData as {
                timestamp: number;
                signature: string;
                apiKey: string;
                cloudName: string;
                folder?: string;
                public_id?: string;
            };

            const formData = new FormData();
            formData.append('file', mediaFile.file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);

            // IMPORTANT: If public_id is signed, it MUST be included in the upload
            if (public_id) {
                formData.append('public_id', public_id);
            }
            // Only append folder if we're NOT using public_id (folder is baked into public_id path)
            if (folder && !public_id) {
                formData.append('folder', folder);
            }


            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            setAttachments(prev => prev.map(a =>
                                a.id === mediaFile.id ? { ...a, uploadProgress: percent } : a
                            ));
                        }
                    }
                }
            );

            const data = response.data;
            const uploadedData: MediaAttachment = {
                type: 'image',
                url: data.secure_url,
                filename: data.original_filename,
                fileSize: data.bytes,
                mimeType: 'image/' + data.format,
                dimensions: { width: data.width, height: data.height },
                cloudinaryPublicId: data.public_id
            };

            setAttachments(prev => prev.map(a =>
                a.id === mediaFile.id
                    ? { ...a, uploadStatus: 'completed' as UploadStatus, uploadProgress: 100, uploadedData }
                    : a
            ));
        } catch (error) {
            setAttachments(prev => prev.map(a =>
                a.id === mediaFile.id
                    ? { ...a, uploadStatus: 'error' as UploadStatus, error: (error as Error).message }
                    : a
            ));
        }
    }, [draftId]);

    const openFileSelector = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileSelection = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image",
            file,
            isNew: true,
            uploadStatus: 'pending' as UploadStatus,
            uploadProgress: 0
        })) as MediaFile[];

        setAttachments((prev) => [...prev, ...newFiles]);

        // Start upload immediately for each new file
        newFiles.forEach(mediaFile => {
            if (mediaFile.type === 'video') {
                uploadVideoToMux(mediaFile);
            } else {
                uploadImageToCloudinary(mediaFile);
            }
        });

        e.target.value = "";
    }, [uploadVideoToMux, uploadImageToCloudinary]);

    const removeAttachment = useCallback(async (id: string) => {
        const attachment = attachments.find(a => a.id === id);

        // Optimistic UI update
        setAttachments((prev) => {
            // Cleanup blob URL
            if (attachment?.url.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.url);
            }
            return prev.filter((f) => f.id !== id);
        });

        // Background cleanup
        if (attachment?.uploadedData) {
            try {
                const type = attachment.uploadedData.type;
                // For Mux, we need the asset ID or upload ID. 
                // uploadedData.muxAssetId is best, fallback to muxUploadId
                let deleteId = '';
                if (type === 'image') {
                    deleteId = attachment.uploadedData.cloudinaryPublicId || '';
                } else if (type === 'video') {
                    deleteId = attachment.uploadedData.muxAssetId || attachment.uploadedData.muxUploadId || '';
                }

                if (deleteId) {
                    await mediaApi.deleteMedia(type as 'image' | 'video', deleteId);
                }
            } catch (error) {
                console.error("Failed to delete media from cloud:", error);
            }
        }
    }, [attachments]);

    const removeAllAttachments = useCallback(async () => {
        // Snapshot for deletion
        const attachmentsToDelete = [...attachments];

        // Optimistic UI update
        attachments.forEach(a => {
            if (a.url.startsWith('blob:')) {
                URL.revokeObjectURL(a.url);
            }
        });
        setAttachments([]);

        // Background cleanup
        await Promise.all(attachmentsToDelete.map(async (attachment) => {
            if (attachment.uploadedData) {
                try {
                    const type = attachment.uploadedData.type;
                    let deleteId = '';
                    if (type === 'image') {
                        deleteId = attachment.uploadedData.cloudinaryPublicId || '';
                    } else if (type === 'video') {
                        deleteId = attachment.uploadedData.muxAssetId || attachment.uploadedData.muxUploadId || '';
                    }

                    if (deleteId) {
                        await mediaApi.deleteMedia(type as 'image' | 'video', deleteId);
                    }
                } catch (error) {
                    console.error(`Failed to delete media ${attachment.id} from cloud:`, error);
                }
            }
        }));
    }, [attachments]);

    const retryUpload = useCallback((id: string) => {
        const mediaFile = attachments.find(a => a.id === id);
        if (!mediaFile || !mediaFile.file) return;

        if (mediaFile.type === 'video') {
            uploadVideoToMux(mediaFile);
        } else {
            uploadImageToCloudinary(mediaFile);
        }
    }, [attachments, uploadVideoToMux, uploadImageToCloudinary]);

    // Computed states
    const isUploading = attachments.some(a => a.uploadStatus === 'uploading');
    const hasUploadError = attachments.some(a => a.uploadStatus === 'error');
    const allUploadsComplete = attachments.every(a =>
        !a.isNew || a.uploadStatus === 'completed'
    );

    return {
        attachments,
        setAttachments,
        fileInputRef,
        openFileSelector,
        handleFileSelection,
        removeAttachment,
        removeAllAttachments,
        retryUpload,
        isUploading,
        hasUploadError,
        allUploadsComplete
    };
};
