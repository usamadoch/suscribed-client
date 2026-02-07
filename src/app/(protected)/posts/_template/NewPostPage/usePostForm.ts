
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getFullImageUrl } from "@/lib/utils";
import { PostVisibility, MediaAttachment, Post, PostType, CreatePostPayload, UpdatePostPayload } from "@/lib/types";
import { postApi, mediaApi } from "@/lib/api";
import axios from "axios";

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

export type UsePostFormProps = {
    initialData?: Post;
    isEditing?: boolean;
};

export const usePostForm = ({ initialData, isEditing = false }: UsePostFormProps = {}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // State
    const [attachments, setAttachments] = useState<MediaFile[]>([]);
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState<PostVisibility>("public");
    const [allowComments, setAllowComments] = useState(true);
    const [isDirty, setIsDirty] = useState(false);

    // Computed states
    const isUploading = attachments.some(a => a.uploadStatus === 'uploading');
    const hasUploadError = attachments.some(a => a.uploadStatus === 'error');
    const allUploadsComplete = attachments.every(a =>
        !a.isNew || a.uploadStatus === 'completed'
    );

    // Initialize state from initialData
    useEffect(() => {
        if (initialData) {
            setCaption(initialData.caption || "");
            setVisibility(initialData.visibility || "public");
            setAllowComments(initialData.allowComments ?? true);

            if (initialData.mediaAttachments?.length) {
                const formattedAttachments: MediaFile[] = initialData.mediaAttachments.map(m => ({
                    id: m.url || (m.type === 'video' && 'muxUploadId' in m ? m.muxUploadId : null) || Math.random().toString(36).substr(2, 9),
                    url: getFullImageUrl(m.url) || "",
                    type: m.type,
                    isNew: false,
                    uploadStatus: 'completed' as UploadStatus,
                    uploadProgress: 100,
                    uploadedData: m
                }));
                setAttachments(formattedAttachments);
            }
        }
    }, [initialData]);

    // Track dirty state
    useEffect(() => {
        if (!initialData) {
            if (caption || attachments.length > 0) setIsDirty(true);
            else setIsDirty(false);
            return;
        }

        const isCaptionChanged = caption !== (initialData.caption || "");
        const isVisibilityChanged = visibility !== (initialData.visibility || "public");
        const isCommentsChanged = allowComments !== (initialData.allowComments ?? true);

        const isAttachmentsChanged =
            attachments.length !== (initialData.mediaAttachments?.length || 0) ||
            attachments.some(a => a.isNew) ||
            !areAttachmentsEqual(attachments, initialData.mediaAttachments || []);

        setIsDirty(isCaptionChanged || isVisibilityChanged || isCommentsChanged || isAttachmentsChanged);

    }, [caption, visibility, allowComments, attachments, initialData]);

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
            const mediaApiResponse = await mediaApi.getMuxUploadUrl();
            const { url, uploadId } = mediaApiResponse;

            // console.log(mediaApiResponse);


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
    }, []);

    // Upload a single image to Cloudinary
    const uploadImageToCloudinary = useCallback(async (mediaFile: MediaFile) => {
        if (!mediaFile.file) return;

        setAttachments(prev => prev.map(a =>
            a.id === mediaFile.id
                ? { ...a, uploadStatus: 'uploading' as UploadStatus, uploadProgress: 0 }
                : a
        ));

        try {
            const { timestamp, signature, apiKey, cloudName } = await mediaApi.getCloudinarySignature();

            const formData = new FormData();
            formData.append('file', mediaFile.file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'posts');

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
    }, []);

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

    const removeAttachment = useCallback((id: string) => {
        setAttachments((prev) => {
            const attachment = prev.find(a => a.id === id);
            // Cleanup blob URL
            if (attachment?.url.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.url);
            }
            return prev.filter((f) => f.id !== id);
        });
    }, []);

    const removeAllAttachments = useCallback(() => {
        attachments.forEach(a => {
            if (a.url.startsWith('blob:')) {
                URL.revokeObjectURL(a.url);
            }
        });
        setAttachments([]);
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

    const mutation = useMutation({
        mutationFn: async () => {
            // Use pre-uploaded data for new files, original data for existing
            const finalAttachments: MediaAttachment[] = attachments.map(fileObj => {
                if (fileObj.uploadedData) {
                    return fileObj.uploadedData;
                }
                // Fallback for existing files without uploadedData
                if (!fileObj.isNew && initialData?.mediaAttachments) {
                    const original = initialData.mediaAttachments.find(
                        m => getFullImageUrl(m.url) === fileObj.url || m.url === fileObj.url
                    );
                    if (original) return original;
                }
                throw new Error(`No upload data for ${fileObj.id}`);
            });

            const payload = {
                caption,
                mediaAttachments: finalAttachments,
                visibility,
                allowComments,
                postType: (finalAttachments.length > 0
                    ? (finalAttachments[0].type === 'video' ? 'video' : 'image')
                    : 'text') as PostType,
                status: 'published' as const,
            } as CreatePostPayload;

            console.log('Creating post with payload:', JSON.stringify(payload, null, 2));

            if (isEditing && initialData) {
                return await postApi.update(initialData._id, payload as UpdatePostPayload);
            } else {
                return await postApi.create(payload);
            }
        },
        onSuccess: (data) => {
            const isUpdate = isEditing && initialData;

            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });

            if (isUpdate) {
                queryClient.invalidateQueries({ queryKey: ['post', initialData._id] });
                toast.success("Post updated successfully");
                router.push(`/posts/${initialData._id}`);
            } else {
                toast.success("Post created successfully");
                router.push('/posts');
                if (!isEditing) {
                    setCaption("");
                    setAttachments([]);
                }
            }
        },
        onError: (error) => {
            console.error("Failed to save post:", error);
            toast.error("Failed to save post");
        }
    });

    const handleSubmit = async () => {
        // console.log('Submitting post...', attachments);
        if (!caption.trim() && attachments.length === 0) {
            toast.error("Please add some content to your post");
            return;
        }
        if (isUploading) {
            toast.error("Please wait for upload to complete");
            return;
        }
        if (hasUploadError) {
            toast.error("Please fix upload errors before publishing");
            return;
        }
        mutation.mutate();
    };

    return {
        attachments,
        caption,
        setCaption,
        visibility,
        setVisibility,
        allowComments,
        setAllowComments,
        fileInputRef,
        openFileSelector,
        handleFileSelection,
        removeAttachment,
        removeAllAttachments,
        retryUpload,
        handleSubmit,
        isSubmitting: mutation.isPending,
        isDirty,
        // New states for UI
        isUploading,
        hasUploadError,
        allUploadsComplete
    };
};

function areAttachmentsEqual(current: MediaFile[], original: MediaAttachment[]) {
    if (current.length !== original.length) return false;
    return current.every((c, i) => {
        if (c.isNew) return false;
        const originalUrl = getFullImageUrl(original[i].url);
        return c.url === originalUrl;
    });
}
