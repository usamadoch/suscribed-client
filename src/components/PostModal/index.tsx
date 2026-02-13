import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { usePostComments } from "@/hooks/useQueries";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Comment from "@/components/Comment";
import { postApi } from "@/lib/api";
import { Post, Comment as CommentType, isLockedMedia } from "@/lib/types";
import { getFullImageUrl } from "@/lib/utils";
import Actions from "@/components/Review/Actions";
import { useAuth } from "@/store/auth";
import Loader from "../Loader";

type PostModalProps = {
    visible: boolean;
    onClose: () => void;
    post: Post | null;
};

const PostModal = ({ visible, onClose, post }: PostModalProps) => {
    const queryClient = useQueryClient();
    const { data: commentsData, isLoading: loadingComments } = usePostComments(post?._id || "");
    const comments = commentsData || [];

    const [commentValue, setCommentValue] = useState("");
    const [sendingComment, setSendingComment] = useState(false);

    const handleSendComment = async () => {
        if (!post || !commentValue.trim()) return;
        setSendingComment(true);
        try {
            await postApi.addComment(post._id, { content: commentValue });
            // Invalidate query to refetch comments
            queryClient.invalidateQueries({ queryKey: ['post-comments', post._id] });
            setCommentValue("");
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSendingComment(false);
        }
    };

    if (!post) return null;

    // Helper to extract image URL
    // We assume the first unlocked image for the main display, similar to the grid logic
    const displayedImage = post.postType === 'image' && !post.isLocked
        ? post.mediaAttachments.find(m => !isLockedMedia(m) && m.url)?.url
        : undefined;

    const fullImageUrl = displayedImage ? getFullImageUrl(displayedImage) : null;

    // Helper to get creator info safely
    // post.creatorId can be string or object depending on population
    const creator = typeof post.creatorId === 'object' ? post.creatorId : null;
    const creatorName = creator?.displayName || creator?.username || "Creator";
    const creatorAvatar = getFullImageUrl(creator?.avatarUrl) || "/images/content/avatar-1.jpg";

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showCloseIcon={false}
            classWrap="max-w-[80rem] bg-n-1 dark:bg-n-1 w-full flex flex-row !p-0 h-[80vh] overflow-hidden md:flex-col md:h-auto md:max-h-[90vh]"
        // classButtonClose="z-20 text-n-1 dark:text-white bg-white/50 dark:bg-n-1/50 rounded-full p-2 hover:bg-white dark:hover:bg-n-1"
        >
            {/* Left Section: Image */}
            <div className="w-2/3 bg-n-1 flex items-center justify-center relative overflow-hidden md:min-h-[20rem]">
                {fullImageUrl ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={fullImageUrl}
                            fill
                            className="object-contain"
                            alt="Post content"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="text-n-3">
                        {post.isLocked ? (
                            <div className="text-center">
                                <Icon name="lock" className="w-12 h-12 fill-white mb-4 mx-auto" />
                                <div className="text-white font-bold mb-2">Members Only</div>
                                <div className="text-sm text-white/70">Join to unlock this content</div>
                            </div>
                        ) : (
                            <span>No image content</span>
                        )}
                    </div>
                )}
            </div>

            {/* Right Section: Details (Stacked) */}
            <div className="w-1/3 shrink-0 bg-white dark:bg-n-1 flex flex-col border-l border-n-3/10 dark:border-white/10 md:w-full md:flex-1 md:h-full">
                {/* 1. Author Header */}
                <div className="p-4 border-b border-n-3 dark:border-white flex items-center shrink-0">
                    <div className="relative w-10 h-10 mr-3">
                        <Image
                            className="object-cover rounded-full"
                            src={creatorAvatar}
                            fill
                            alt={creatorName}
                            unoptimized
                        />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-n-1 dark:text-white">{creatorName}</div>
                        <div className="text-xs text-n-3">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* 2. Scrollable Comments List */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {/* Post Caption as first item if exists */}
                    {post.caption && !post.isLocked && (
                        <div className="">
                            <p className="text-sm text-n-1 dark:text-white">{post.caption}</p>
                        </div>
                    )}

                    {loadingComments ? (
                        <div className="flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <div className="relative w-8 h-8 shrink-0">
                                    <Image
                                        className="object-cover rounded-full"
                                        src={
                                            typeof comment.authorId === 'object'
                                                ? getFullImageUrl(comment.authorId.avatarUrl) || "/images/content/avatar-1.jpg"
                                                : "/images/content/avatar-1.jpg"
                                        }
                                        fill
                                        alt="User"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-n-1 dark:text-white">
                                            {typeof comment.authorId === 'object' ? comment.authorId.displayName : "User"}
                                        </span>
                                        {/* Time could be added here if available in comment data */}
                                    </div>
                                    <p className="text-sm text-n-1 dark:text-white/80 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-n-3 text-sm">
                            No comments yet. Be the first!
                        </div>
                    )}
                </div>

                <div className="px-4">
                    <Actions
                        postId={post._id}
                        likes={post.likeCount}
                        comments={post.commentCount}
                        isLiked={post.isLiked || false}
                        showComment={false}
                    />
                </div>



                {/* 3. Fixed Comment Input */}
                <div className="p-4 shrink-0">
                    <Comment

                        placeholder="Write a comment..."
                        value={commentValue}
                        setValue={(e) => setCommentValue(e.target.value)}
                        onSend={handleSendComment}
                        disabled={sendingComment || post.isLocked}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PostModal;
