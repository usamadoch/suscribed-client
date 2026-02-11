"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";

import MediaBlock from "../../../_template/PostDetailPage/MediaBlock";
import MediaCarousel from "../../../_template/PostDetailPage/MediaCarousel";
import LockedContent from "../../../_template/PostDetailPage/LockedContent";
import CommentsSection from "../../../_template/PostDetailPage/CommentsSection";

import { usePost, usePostComments, useJoinPage } from "@/hooks/useQueries";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import Image from "@/components/Image";

import { getFullImageUrl } from "@/lib/utils";

import { postApi } from "@/lib/api";
import { MediaAttachment, isUnlockedMedia, AnyMediaAttachment } from "@/lib/types";
import CreatorHeader from "@/layout/CreatorHeader";



import Actions from "@/components/Review/Actions";

const PostDetailPage = () => {
    const params = useParams<{ id: string }>();
    const postId = params.id as string;
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: post, isLoading: isPostLoading } = usePost(postId);
    const { data: comments, isLoading: isCommentsLoading } = usePostComments(postId);


    console.log(post);

    // Use the backend-provided isLocked flag
    const locked = post?.isLocked ?? false;

    const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    const [value, setValue] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const isLoading = isPostLoading || isCommentsLoading;

    const handleCommentSubmit = async () => {
        if (!value.trim()) return;

        setIsSubmittingComment(true);
        try {
            const { comment } = await postApi.addComment(postId, { content: value });
            toast.success("Comment added");
            setValue("");

            // Update cache immediately to show new comment
            queryClient.setQueryData(['post-comments', postId], (oldComments: any[] | undefined) => {
                return oldComments ? [comment, ...oldComments] : [comment];
            });

            // Invalidate/refetch comments to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
            // Optionally update post comment count
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Get media items from post
    const mediaItems: AnyMediaAttachment[] = post?.mediaAttachments && post.mediaAttachments.length > 0
        ? post.mediaAttachments
        : [];

    // Get unlocked media for display (when not locked)
    const unlockedMediaItems = mediaItems.filter(isUnlockedMedia);

    // Get display content: teaser for locked posts, caption for unlocked
    const displayCaption = locked
        ? post?.teaser || 'Exclusive content for members'
        : post?.caption || '';

    const handleJoin = () => {
        if (!post) return;
        if (user) {
            const creatorId = typeof post.creatorId === 'object' ? (post.creatorId as any)._id : post.creatorId;
            const pageId = typeof post.pageId === 'object' ? post.pageId._id : post.pageId;
            joinPage({ creatorId, pageId }, {
                onSuccess: () => toast.success("Joined successfully!")
            });
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="w-full h-96 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : !post ? (
                <div className="p-10 text-center text-n-1 dark:text-white">Post not found</div>
            ) : (
                <>

                    <CreatorHeader pageSlug={typeof post.pageId === 'object' ? post.pageId.pageSlug : undefined} />
                    <div className="w-full">
                        {/* Media Gallery */}
                        {mediaItems.length > 0 && locked ? (
                            <div className="relative w-full h-[512px] bg-n-2 mb-6 overflow-hidden">
                                <LockedContent type="overlay" text="Join to unlock this content" />
                                {/* Show blurred thumbnail from backend (already blurred by Cloudinary) */}
                                <Image
                                    className="object-contain "
                                    src={mediaItems[0].thumbnailUrl || "/images/img-1.jpg"}
                                    fill
                                    alt="Locked content preview"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            unlockedMediaItems.length > 1 ? (
                                <MediaCarousel items={unlockedMediaItems} />
                            ) : (
                                unlockedMediaItems.map((media: MediaAttachment, index: number) => (
                                    <MediaBlock
                                        key={index}
                                        media={media}
                                        className="mb-4"
                                    />
                                ))
                            )
                        )}

                        <div className="max-w-4xl mx-auto p-5">
                            {!locked && (
                                <div className="flex justify-end">
                                    <Actions
                                        postId={post._id}
                                        likes={post.likeCount}
                                        comments={post.commentCount}
                                        isLiked={post.isLiked || false}
                                        className="mb-4"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <div className={`text-sm whitespace-pre-wrap mb-6 text-n-1 dark:text-white ${locked ? "blur-xs select-none" : ""}`}>
                                    {displayCaption}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm text-n-3 border-b border-n-1 dark:border-white/10 pb-4 mb-6">
                                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                <div className="flex gap-4">
                                    <span>{post.viewCount} views</span>
                                </div>
                            </div>

                            {locked ? (
                                <LockedContent
                                    handleJoin={handleJoin}
                                    isJoining={isJoining}
                                    user={user}
                                    isLoginModalOpen={isLoginModalOpen}
                                    setIsLoginModalOpen={setIsLoginModalOpen}
                                />
                            ) : (
                                <CommentsSection
                                    user={user}
                                    value={value}
                                    setValue={setValue}
                                    handleCommentSubmit={handleCommentSubmit}
                                    isSubmittingComment={isSubmittingComment}
                                    comments={comments || []}
                                />
                            )}
                        </div>

                    </div>

                </>
            )
            }
        </>
    );
};

export default PostDetailPage;

