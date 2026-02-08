
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getFullImageUrl } from "@/lib/utils";
import { PostVisibility, MediaAttachment, Post, PostType, CreatePostPayload, UpdatePostPayload, getUnlockedMediaAttachments } from "@/lib/types";
import { postApi } from "@/lib/api";
import { useMediaUpload, MediaFile } from "./hooks/useMediaUpload";
import { generateObjectId } from "@/lib/idGenerator";

export type UsePostFormProps = {
    initialData?: Post;
    isEditing?: boolean;
};

export const usePostForm = ({ initialData, isEditing = false }: UsePostFormProps = {}) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Use existing ID if editing, otherwise generate a new draft ID for this session
    const draftId = useMemo(() => initialData?._id || generateObjectId(), [initialData]);

    // State
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState<PostVisibility>("public");
    const [allowComments, setAllowComments] = useState(true);
    const [isDirty, setIsDirty] = useState(false);

    // Media Upload Hook
    const {
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
    } = useMediaUpload(draftId, initialData ? getUnlockedMediaAttachments(initialData) : undefined);

    // Initialize state from initialData
    useEffect(() => {
        if (initialData) {
            setCaption(initialData.caption || "");
            setVisibility(initialData.visibility || "public");
            setAllowComments(initialData.allowComments ?? true);
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

        const initialMediaAttachments = initialData ? getUnlockedMediaAttachments(initialData) : [];
        const isAttachmentsChanged =
            attachments.length !== initialMediaAttachments.length ||
            attachments.some(a => a.isNew) ||
            !areAttachmentsEqual(attachments, initialMediaAttachments);

        setIsDirty(isCaptionChanged || isVisibilityChanged || isCommentsChanged || isAttachmentsChanged);

    }, [caption, visibility, allowComments, attachments, initialData]);


    const mutation = useMutation({
        mutationFn: async () => {
            // Use pre-uploaded data for new files, original data for existing
            const finalAttachments: MediaAttachment[] = attachments.map(fileObj => {
                if (fileObj.uploadedData) {
                    return fileObj.uploadedData;
                }
                // Fallback for existing files without uploadedData
                if (!fileObj.isNew && initialData) {
                    const originalAttachments = getUnlockedMediaAttachments(initialData);
                    const original = originalAttachments.find(
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

            // Include ID if creating new post
            if (!isEditing) {
                payload._id = draftId;
            }

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
