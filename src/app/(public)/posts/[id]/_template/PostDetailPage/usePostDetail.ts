"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";
import { usePost, usePostComments, useJoinPage } from "@/hooks/useQueries";
import { postApi } from "@/lib/api";
import {
    Post,
    MediaAttachment,
    AnyMediaAttachment,
    isUnlockedMedia,
    CreatorPage,
    Comment as PostComment,
} from "@/lib/types";

/** MongoDB ObjectId: exactly 24 hex characters */
const isValidObjectId = (id: string): boolean => /^[a-f\d]{24}$/i.test(id);

interface UsePostDetailReturn {
    // Data
    post: Post | null | undefined;
    comments: PostComment[] | undefined;
    pageSlug: string | undefined;

    // Validation
    isValidId: boolean;

    // Loading states
    isPostLoading: boolean;
    isCommentsLoading: boolean;

    // Derived post state
    locked: boolean;
    mediaItems: AnyMediaAttachment[];
    unlockedMediaItems: MediaAttachment[];
    displayCaption: string;

    // Comment form
    commentValue: string;
    setCommentValue: (value: string) => void;
    handleCommentSubmit: () => Promise<void>;
    isSubmittingComment: boolean;

    // Join / Auth
    handleJoin: () => void;
    isJoining: boolean;
    isLoginModalOpen: boolean;
    setIsLoginModalOpen: (open: boolean) => void;

    // Auth user
    user: ReturnType<typeof useAuth>["user"];
}

/**
 * Encapsulates all data-fetching, derived state, and mutation logic
 * for the post detail page.
 */
export const usePostDetail = (postId: string): UsePostDetailReturn => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // ── Validate ID format (skip all requests if invalid) ───
    const isValidId = isValidObjectId(postId);
    const queryId = isValidId ? postId : '';

    // ── Queries (disabled when ID is invalid) ───────────────
    const { data: post, isLoading: isPostLoading } = usePost(queryId);
    const { data: comments, isLoading: isCommentsLoading } = usePostComments(queryId);

    // ── Join mutation ────────────────────────────────────────
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    // ── Local state ──────────────────────────────────────────
    const [commentValue, setCommentValue] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // ── Derived values ───────────────────────────────────────
    const locked = post?.isLocked ?? false;

    const mediaItems: AnyMediaAttachment[] =
        post?.mediaAttachments && post.mediaAttachments.length > 0
            ? post.mediaAttachments
            : [];

    const unlockedMediaItems = mediaItems.filter(isUnlockedMedia);

    const displayCaption = locked
        ? post?.teaser || "Exclusive content for members"
        : post?.caption || "";

    // Derive pageSlug from the populated pageId object
    const pageSlug: string | undefined =
        post && typeof post.pageId === "object"
            ? (post.pageId as Pick<CreatorPage, "_id" | "pageSlug">).pageSlug
            : undefined;

    // ── Handlers ─────────────────────────────────────────────

    const handleCommentSubmit = async () => {
        if (!commentValue.trim()) return;

        setIsSubmittingComment(true);
        try {
            const { comment } = await postApi.addComment(postId, {
                content: commentValue,
            });
            toast.success("Comment added");
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
            toast.error("Failed to add comment");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleJoin = () => {
        if (!post) return;

        if (user) {
            const creatorId =
                typeof post.creatorId === "object"
                    ? post.creatorId._id
                    : post.creatorId;
            const pageId =
                typeof post.pageId === "object" ? post.pageId._id : post.pageId;

            joinPage(
                { creatorId, pageId },
                { onSuccess: () => toast.success("Joined successfully!") }
            );
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return {
        post,
        comments,
        pageSlug,
        isValidId,
        isPostLoading,
        isCommentsLoading,
        locked,
        mediaItems,
        unlockedMediaItems,
        displayCaption,
        commentValue,
        setCommentValue,
        handleCommentSubmit,
        isSubmittingComment,
        handleJoin,
        isJoining,
        isLoginModalOpen,
        setIsLoginModalOpen,
        user,
    };
};
