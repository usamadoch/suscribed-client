import { useState } from "react";
import { formatAppDate } from "@/lib/date";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { usePostComments } from "@/hooks/useQueries";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Comment from "@/components/Comment";
import { postApi } from "@/lib/api";
import { Post, isLockedMedia, CreatorPage } from "@/lib/types";
import Actions from "@/components/Review/Actions";
import Loader from "@/components/Loader";
import CommentItem from "@/components/CommentItem";
import ReadMore from "@/components/ReadMore";
import ActionMenu from "@/components/ActionMenu";
import { getCreatorInfo } from "@/lib/post-mapper";

type PostModalProps = {
    visible: boolean;
    onClose: () => void;
    post: Post | null;
    page?: CreatorPage;
};

const PostModal = ({ visible, onClose, post, page }: PostModalProps) => {
    const queryClient = useQueryClient();
    const { data: commentsData, isLoading: loadingComments } = usePostComments(post?._id || "");
    const comments = commentsData || [];

    const [commentValue, setCommentValue] = useState("");
    const [sendingComment, setSendingComment] = useState(false);

    const shareItems = post ? [
        {
            label: "Copy link",
            icon: "copy",
            viewBox: "0 0 24 24",
            onClick: () => {
                const shareUrl = `/post/${post._id}`;
                const fullUrl = `${window.location.origin}${shareUrl}`;
                navigator.clipboard.writeText(fullUrl);
                toast.success("Link copied to clipboard");
            },
        }
    ] : [];

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

    // Helper to extract media
    const displayedImage = post.postType === 'image' && !post.isLocked
        ? post.mediaAttachments.find(m => !isLockedMedia(m) && m.url)?.url
        : undefined;

    // Use centralized creator info logic
    const creator = getCreatorInfo(post, page);

    const showMediaSection = post.postType === 'image' && (!!displayedImage || post.isLocked);


    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showCloseIcon={false}
            classWrap={`${showMediaSection ? "max-w-[80rem]" : "max-w-[40rem]"} bg-n-1 dark:bg-n-1 w-full flex flex-row !p-0 h-[80vh] overflow-hidden md:flex-col md:h-auto md:max-h-[90vh]`}
        >
            {/* Left Section: Image/Media */}
            {showMediaSection && (
                <div className="w-3/5 bg-n-1 flex items-center justify-center relative overflow-hidden md:min-h-80">
                    {displayedImage ? (
                        <div className="relative w-full h-full">
                            <Image
                                family="post"
                                slot="modal"
                                src={displayedImage}
                                fill
                                className="object-contain"
                                alt="Post content"
                            />
                        </div>
                    ) : (
                        <div className="text-n-3">
                            {post.isLocked && (
                                <div className="text-center">
                                    <Icon name="lock" className="w-12 h-12 fill-white mb-4 mx-auto" />
                                    <div className="text-white font-bold mb-2 dark:text-n-9">Members Only</div>
                                    <div className="text-sm text-white/70 dark:text-n-8">Join to unlock this content</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Right Section: Details (Stacked) */}
            <div className={`${showMediaSection ? "w-2/5" : "w-full"} shrink-0 bg-white dark:bg-n-1 flex flex-col dark:border-n-6 md:w-full md:flex-1 md:h-full`}>
                {/* 1. Author Header */}
                <div className="p-4 border-b border-n-4 dark:border-n-6 flex items-center shrink-0">
                    <div className="relative w-10 h-10 mr-3">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="dropdown"
                            src={creator.avatarUrl}
                            fill
                            alt={creator.displayName}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="capitalize font-bold text-base text-n-1 dark:text-n-9">{creator.displayName}</div>
                        <div className="text-sm text-n-3 dark:text-n-8">•</div>
                        <div className="text-sm text-n-3 dark:text-n-8">{formatAppDate(post.createdAt, { suffix: true })}</div>
                    </div>
                    <ActionMenu
                        className="ml-auto"
                        items={shareItems}
                    />
                </div>

                {/* 2. Scrollable Comments List */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {/* Post Caption as first item if exists */}
                    {post.caption && !post.isLocked && (
                        <div className="">
                            <p className="text-base text-n-1 dark:text-n-9">
                                <ReadMore words={100}>{post.caption}</ReadMore>
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {loadingComments ? (
                            <div className="flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    variant="modal"
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-n-3 text-sm dark:text-n-8">
                                No comments yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4">
                    <Actions
                        postId={post._id}
                        likes={post.likeCount}
                        comments={post.commentCount}
                        isLiked={post.isLiked || false}
                        showComment={false}
                        shareUrl={`/post/${post._id}`}
                        type="post"
                    />
                </div>

                {/* 3. Fixed Comment Input */}
                <div className="p-4 shrink-0">
                    <Comment
                        placeholder={post.allowComments ? "Write a comment..." : "Comments are turned off."}
                        className="shadow-none"
                        value={commentValue}
                        setValue={(e) => setCommentValue(e.target.value)}
                        onSend={handleSendComment}
                        disabled={!post.allowComments || sendingComment || post.isLocked}
                        inputDisabled={!post.allowComments}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PostModal;
