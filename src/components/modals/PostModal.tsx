import { useState } from "react";
import { formatAppDate } from "@/lib/date";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { usePostComments } from "@/hooks/queries";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import Images from "@/components/PostCard/Images";
import { Icon } from "@/components/ui/icon";
import { Copy, LockKeyhole } from "@/lib/icons";
import Comment from "@/components/Comment";
import { postService as postApi } from "@/services/post.service";
import { Post, isLockedMedia, CreatorPage, VideoAttachment } from "@/types";
import MuxVideoPlayer from "@/components/MuxVideoPlayer";
import Actions from "@/components/PostCard/Actions";
import Loader from "@/components/Loader";
import CommentItem from "@/components/CommentItem";
import ReadMore from "@/components/ReadMore";
import ActionMenu from "@/components/ActionMenu";
import Alert from "@/components/Alert";
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
            icon: Copy,
            onClick: () => {
                const shareUrl = `/posts/${post._id}`;
                const fullUrl = `${window.location.origin}${shareUrl}`;
                navigator.clipboard.writeText(fullUrl);
                toast.custom((t) => (
                    <Alert
                        className="mb-0 shadow-md"
                        type="success"
                        message="Link copied to clipboard"
                        onClose={() => toast.dismiss(t.id)}
                    />
                ), { position: "bottom-right" });
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
    const displayedImages = post.postType === 'image' && !post.isLocked
        ? post.mediaAttachments.filter(m => !isLockedMedia(m) && m.type === 'image' && m.url).map(m => m.url as string)
        : [];

    const displayedVideo = post.postType === 'video' && !post.isLocked
        ? post.mediaAttachments.find(m => !isLockedMedia(m) && m.type === 'video') as VideoAttachment | undefined
        : undefined;

    const firstImage = post.postType === 'image' && !post.isLocked
        ? post.mediaAttachments.find(m => !isLockedMedia(m) && m.type === 'image' && m.url) as any
        : undefined;

    const mediaAspectRatio = firstImage?.dimensions
        ? `${firstImage.dimensions.width} / ${firstImage.dimensions.height}`
        : displayedVideo?.dimensions
            ? `${displayedVideo.dimensions.width} / ${displayedVideo.dimensions.height}`
            : undefined;

    // Use centralized creator info logic
    const creator = getCreatorInfo(post, page);

    const showMediaSection = (post.postType === 'image' || post.postType === 'video') && (displayedImages.length > 0 || !!displayedVideo || post.isLocked);


    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showCloseIcon={false}
            classWrap={`${showMediaSection ? "max-w-[80rem] w-fit" : "max-w-[40rem] w-full"} bg-n-1 dark:bg-n-1 flex flex-row !p-0 h-[80vh] overflow-hidden md:w-full md:flex-col md:h-auto md:max-h-[90vh] md:overflow-y-auto`}
        >

            {/* Left Section: Image/Media */}
            {showMediaSection && (
                <div
                    style={{ aspectRatio: mediaAspectRatio }}
                    className={`bg-n-1 flex items-center justify-center relative overflow-hidden md:w-full md:h-auto md:order-3 ${mediaAspectRatio ? "w-auto h-[80vh] max-w-[56rem] max-w-[calc(100vw-24rem)] xl:max-w-[calc(100vw-22rem)]" : "w-160 lg:w-120 h-[80vh]"}`}
                >
                    {displayedImages.length > 0 ? (
                        <Images
                            items={displayedImages}
                            slot="modal"
                            className="relative group w-full h-full"
                        />
                    ) : displayedVideo ? (
                        <div className="relative w-full h-full bg-black">
                            <MuxVideoPlayer
                                playbackId={displayedVideo.muxPlaybackId}
                                status={displayedVideo.status}
                                fallbackSrc={displayedVideo.url}
                                className="w-full h-full"
                                autoPlay
                            />
                        </div>
                    ) : (
                        <div className="text-n-3">
                            {post.isLocked && (
                                <div className="text-center">
                                    <Icon icon={LockKeyhole} className="w-12 h-12 text-n-9 fill-current mb-4 mx-auto" />
                                    <div className="text-white font-bold mb-2 dark:text-n-9">Members Only</div>
                                    <div className="text-sm text-white/70 dark:text-n-8">Join to unlock this content</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Right Section: Details (Stacked) */}
            <div className={`${showMediaSection ? "w-md xl:w-88" : "w-full"} shrink-0 bg-white dark:bg-n-1 flex flex-col dark:border-n-6 md:w-full md:contents`}>
                {/* 1. Author Header */}
                <div className="p-4 flex items-center shrink-0 md:order-1">
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

                {/* 2. Caption Section (Extracted for mobile ordering) */}
                {post.caption && !post.isLocked && (
                    <div className="p-4 md:order-2">
                        <p className="text-base text-n-1 dark:text-n-9">
                            <ReadMore words={100}>{post.caption}</ReadMore>
                        </p>
                    </div>
                )}

                {/* 3. Comments and Actions Area */}
                <div className="flex-1 flex flex-col overflow-hidden md:order-4 md:overflow-visible">
                    {/* Scrollable Comments List */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 md:overflow-visible md:p-4">
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
                            shareUrl={`/posts/${post._id}`}
                            type="post"
                        />
                    </div>

                    {/* Fixed Comment Input */}
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
            </div>
        </Modal>
    );
};

export default PostModal;
