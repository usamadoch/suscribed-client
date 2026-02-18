import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Icon from "@/components/Icon";
import { postApi } from "@/lib/api";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/LoginModal";
import ShareModal from "@/components/ShareModal";
import Comment from "@/components/Comment";
import { twMerge } from "tailwind-merge";

type ActionsProps = {
    postId: string;
    comments: number;
    likes: number;
    isLiked: boolean;
    className?: string;
    showComment?: boolean;
    shareUrl?: string;
    type?: 'post' | 'comment';
};

const Actions = ({ postId, comments, likes: initialLikes, isLiked: initialIsLiked, className, showComment = true, shareUrl, type = 'post' }: ActionsProps) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState<boolean>(initialIsLiked);
    const [likesCount, setLikesCount] = useState<number>(initialLikes);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);

    // Comment state
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    // Refs for debouncing and server synchronization
    const serverLiked = useRef<boolean>(initialIsLiked);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync state with props if they change (e.g. from parent re-render due to invalidation)
    useEffect(() => {
        setLiked(initialIsLiked);
        serverLiked.current = initialIsLiked;
    }, [initialIsLiked]);

    useEffect(() => {
        setLikesCount(initialLikes);
    }, [initialLikes]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const syncLike = async (targetLiked: boolean) => {
        // Only call API if the desired state is different from the last known server state
        if (targetLiked === serverLiked.current) return;

        try {
            // Optimistic update already happened. Just sync.
            const res = await postApi.toggleLike(postId);

            // Update server truth based on response
            // The API returns { liked: boolean } - if it matches our target, we're good.
            // If it doesn't (race condition?), we might need to revert or sync up.
            // For now, assume success means the toggle happened.
            serverLiked.current = targetLiked;

            // Invalidate queries to reflect changes elsewhere (e.g. post list, modal)
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });

        } catch (error) {
            console.error('Failed to toggle like', error);
            // Revert UI on error
            setLiked(serverLiked.current);
            setLikesCount(prev => serverLiked.current ? prev + 1 : prev - 1);
        }
    };

    const handleLike = async (e: React.MouseEvent): Promise<void> => {
        e.stopPropagation();

        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        // 1. Optimistic UI Update
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikesCount(prev => nextLiked ? prev + 1 : prev - 1);

        // Trigger animation
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        // 2. Debounce the server sync
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            syncLike(nextLiked);
        }, 400); // 1 second debounce
    };

    return (
        <>
            <div className={`flex items-center ${className || "mt-4"}`}>

                <button
                    className={`flex gap-1 px-0 cursor-pointer active:scale-90 transition-transform`}
                    onClick={handleLike}
                >
                    <Icon
                        name={liked ? "like-filled" : "like"}
                        className={twMerge(
                            "transition-colors",
                            animating && "animate-heart-pop",
                            liked ? "fill-purple-1" : "fill-n-1 dark:fill-white"
                        )}
                        viewBox="0 0 512 512"
                    />
                    {/* <span className="text-md">{likesCount}</span> */}
                    <span className="text-xs">{likesCount}</span>
                </button>


                {showComment && (
                    <button className="flex gap-1 ml-5 px-0">
                        <Icon name="comments" />
                        <span className="text-xs">{comments}</span>
                    </button>
                )}



                <button
                    className={` ml-auto cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (type === 'post') {
                            setShowShareModal(true);
                        } else {
                            setIsCommentOpen(!isCommentOpen);
                        }
                    }}
                >

                    <Icon name="reply" />
                </button>
            </div>
            {showShareModal && shareUrl && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ShareModal
                        visible={showShareModal}
                        onClose={() => setShowShareModal(false)}
                        shareUrl={shareUrl}
                        title="Share this post"
                    />
                </div>
            )}
            {isCommentOpen && type === 'comment' && (
                <Comment
                    className="mt-4 mb-2 pr-4! py-0! pl-0! border-dashed shadow-none md:-ml-12 md:pr-3!"
                    placeholder="Type to add your comment"
                    value={commentValue}
                    setValue={(e) => setCommentValue(e.target.value)}
                />
            )}
            <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <LoginModal
                    visible={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            </div>

        </>
    );
};

export default Actions;
