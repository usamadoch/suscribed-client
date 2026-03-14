import { useState, createElement } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Alert from "@/components/Alert";
import { postApi } from "@/lib/api";
import { Comment as PostComment } from "@/lib/types";

export const usePostComment = (postId: string) => {
    const queryClient = useQueryClient();
    const [commentValue, setCommentValue] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleCommentSubmit = async () => {
        if (!commentValue.trim()) return;

        setIsSubmittingComment(true);
        try {
            const { comment } = await postApi.addComment(postId, {
                content: commentValue,
            });
            toast.custom((t) =>
                createElement(Alert, {
                    type: "success",
                    message: "Your comment has been successfully.",
                    onClose: () => toast.dismiss(t.id),
                })
            );
            setCommentValue("");

            // Optimistic cache update
            queryClient.setQueryData(
                ["post-comments", postId],
                (oldComments: PostComment[] | undefined) =>
                    oldComments ? [comment, ...oldComments] : [comment]
            );

            // Revalidate for consistency
            queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        } catch (error) {
            console.error(error);
            toast.custom((t) =>
                createElement(Alert, {
                    type: "error",
                    message: "Failed to publish your comment. Please try again later.",
                    onClose: () => toast.dismiss(t.id),
                })
            );
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return {
        commentValue,
        setCommentValue,
        isSubmittingComment,
        handleCommentSubmit
    };
};
