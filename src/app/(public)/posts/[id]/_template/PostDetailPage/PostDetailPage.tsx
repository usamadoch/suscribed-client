"use client";

import { useParams } from "next/navigation";

// CreatorHeader moved to layout
import Loader from "@/components/Loader";

import { usePostDetail } from "./usePostDetail";
import PostContentArea from "./PostContentArea";
import PostLoadingSkeleton from "./PostLoadingSkeleton";
import LockedContent from "./LockedContent";
import CommentsSection from "./CommentsSection";
import JoinTierModal from "@/components/modals/JoinTierModal";

// ─── Component ──────────────────────────────────────────────

const PostDetailPage = () => {
    const params = useParams<{ id: string }>();
    const postId = params.id as string;

    const {
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
        isLoginModalOpen,
        setIsLoginModalOpen,
        isJoinTierModalOpen,
        setIsJoinTierModalOpen,
        user,
    } = usePostDetail(postId);

    const creatorPageForModal = post ? {
        _id: typeof post.pageId === "object" ? post.pageId._id : post.pageId,
        pageSlug: pageSlug || "",
        userId: post.creatorId
    } as any : null;

    return (
        <>
            {/* ── Post Content Area ─────────────────────────── */}
            {!isValidId || (!isPostLoading && !post) ? (
                <div className="p-10 text-center text-n-1 dark:text-n-8">
                    Post not found
                </div>
            ) : isPostLoading ? (
                <PostLoadingSkeleton />
            ) : (
                <>
                    {/* CreatorHeader removed from here, now in layout */}
                    <PostContentArea
                        post={post!}
                        locked={locked}
                        mediaItems={mediaItems}
                        unlockedMediaItems={unlockedMediaItems}
                        displayCaption={displayCaption}
                    />
                    {/* ── Comments / Locked Section ─────────────────── */}
                    <div className="max-w-4xl mx-auto w-full p-5">
                        {locked ? (
                            <LockedContent
                                handleJoin={handleJoin}
                                user={user}
                                isLoginModalOpen={isLoginModalOpen}
                                setIsLoginModalOpen={setIsLoginModalOpen}
                            />
                        ) : isCommentsLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader />
                            </div>
                        ) : (
                            <CommentsSection
                                user={user}
                                value={commentValue}
                                setValue={setCommentValue}
                                handleCommentSubmit={handleCommentSubmit}
                                isSubmittingComment={isSubmittingComment}
                                comments={comments || []}
                                allowComments={post?.allowComments ?? true}
                            />
                        )}
                    </div>
                </>
            )}
            
            {creatorPageForModal && (
                <JoinTierModal
                    visible={isJoinTierModalOpen}
                    onClose={() => setIsJoinTierModalOpen(false)}
                    page={creatorPageForModal}
                />
            )}
        </>
    );
};

export default PostDetailPage;
