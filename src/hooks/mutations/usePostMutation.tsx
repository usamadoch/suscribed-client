import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Alert from "@/components/Alert";
import { postService as postApi } from "@/services/post.service";
import { CreatePostPayload, UpdatePostPayload, Post, MediaAttachment, PostType, getUnlockedMediaAttachments } from "@/types";
import { MediaFile } from "@/app/(protected)/(creator)/posts/_template/NewPostPage/hooks/useMediaUpload";
// import { generateObjectId } from "@/lib/idGenerator";

type UsePostMutationProps = {
    isEditing: boolean;
    initialData?: Post;
    draftId: string;
    onSuccessCb?: () => void;
};

export const usePostMutation = ({ isEditing, initialData, draftId, onSuccessCb }: UsePostMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caption, visibility, allowComments, attachments }: { caption: string, visibility: string, allowComments: boolean, attachments: MediaFile[] }) => {
            const finalAttachments: MediaAttachment[] = attachments.map(fileObj => {
                if (fileObj.uploadedData) {
                    return fileObj.uploadedData;
                }
                if (!fileObj.isNew && initialData) {
                    const originalAttachments = getUnlockedMediaAttachments(initialData);
                    const original = originalAttachments.find(m => m.url === fileObj.url);
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

            if (!isEditing) {
                payload._id = draftId;
            }

            if (isEditing && initialData) {
                return await postApi.update(initialData._id, payload as UpdatePostPayload);
            } else {
                return await postApi.create(payload);
            }
        },
        onSuccess: () => {
            const isUpdate = isEditing && initialData;

            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });

            if (isUpdate) {
                queryClient.invalidateQueries({ queryKey: ['post', initialData._id] });
                // toast.custom((t) => (
                //     <Alert
                //         className="mb-0 shadow-md"
                //         type="success"
                //         message="Post updated successfully"
                //         onClose={() => toast.dismiss(t.id)}
                //     />
                // ), { position: "bottom-right" });
            } else {
                // toast.custom((t) => (
                //     <Alert
                //         className="mb-0 shadow-md"
                //         type="success"
                //         message="Post created successfully"
                //         onClose={() => toast.dismiss(t.id)}
                //     />
                // ), { position: "bottom-right" });

                onSuccessCb?.();
            }
        },
        onError: (error) => {
            console.error("Failed to save post:", error);
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="error"
                    message="Failed to save post"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        }
    });
};
