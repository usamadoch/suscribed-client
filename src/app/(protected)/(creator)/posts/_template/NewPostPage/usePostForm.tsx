
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import Alert from "@/components/Alert";
import { usePostMutation } from "@/hooks/mutations/usePostMutation";

import { PostVisibility, MediaAttachment, Post, getUnlockedMediaAttachments } from "@/types";
import { useMediaUpload, MediaFile } from "./hooks/useMediaUpload";
import { generateObjectId } from "@/lib/idGenerator";

export type UsePostFormProps = {
    initialData?: Post;
    isEditing?: boolean;
};

export const usePostForm = ({ initialData, isEditing = false }: UsePostFormProps = {}) => {


    // Use existing ID if editing, otherwise generate a new draft ID for this session
    const [draftId, setDraftId] = useState(() => initialData?._id || generateObjectId());

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
            setDraftId(initialData._id || generateObjectId());
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

    const mutation = usePostMutation({
        isEditing,
        initialData,
        draftId,
        onSuccessCb: () => {
            if (!isEditing) {
                setCaption("");
                setAttachments([]);
                setDraftId(generateObjectId());
            }
        }
    });

    const handleSubmit = async () => {
        if (!caption.trim() && attachments.length === 0) {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="error"
                    message="Please add some content to your post"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
            return;
        }
        if (isUploading) {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="error"
                    message="Please wait for upload to complete"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
            return;
        }
        if (hasUploadError) {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="error"
                    message="Please fix upload errors before publishing"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
            return;
        }
        mutation.mutate({ caption, visibility, allowComments, attachments });
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
        const originalUrl = original[i].url;
        return c.url === originalUrl;
    });
}
