import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MenuButton, Menu as MenuDropdown, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import { postApi } from "@/lib/api";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/LoginModal";
import Alert from "@/components/Alert";
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
            const res = await postApi.toggleLike(postId);

            // Sync with server truth — use the authoritative liked state & count
            serverLiked.current = res.liked;
            setLiked(res.liked);
            setLikesCount(Math.max(0, res.likeCount));

            // Invalidate queries to reflect changes elsewhere (e.g. post list, modal)
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });

        } catch (error) {
            console.error('Failed to toggle like', error);
            // Revert UI on error
            setLiked(serverLiked.current);
            setLikesCount(prev => Math.max(0, serverLiked.current ? prev + 1 : prev - 1));
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
        setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

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
                    className={`flex items-center gap-1 px-0 cursor-pointer active:scale-90 transition-transform`}
                    onClick={handleLike}
                >
                    <Icon
                        name={liked ? "like-filled" : "like"}
                        className={twMerge(
                            "transition-colors ",
                            animating && "animate-heart-pop",
                            liked ? "fill-purple-1 icon-20" : "fill-n-1 icon-18 dark:fill-white"
                        )}
                        viewBox="0 0 512 512"
                    />
                    {/* <span className="text-md">{likesCount}</span> */}
                    <span className="text-xs">{likesCount}</span>
                </button>


                {showComment && (
                    <button className="flex items-center gap-1 ml-4 px-0">
                        <Icon name="comments" className="icon-20" viewBox="0 0 24 24" />
                        <span className="text-xs">{comments}</span>
                    </button>
                )}



                {type === 'post' ? (
                    <MenuDropdown as="div" className="ml-4 relative">
                        <MenuButton
                            className="px-0 cursor-pointer flex items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Icon name="reply" className="icon-18 dark:fill-white" viewBox="0 0 512 512" />
                        </MenuButton>
                        <MenuItems
                            transition
                            portal
                            anchor="bottom end"
                            className="z-100 w-[14.69rem] py-2 border border-n-1 bg-white shadow-primary-4 dark:bg-n-1 dark:border-white [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                        >
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    navigator.clipboard.writeText(fullUrl);
                                    toast.custom((t) => (
                                        <Alert
                                            className="mb-0 shadow-md"
                                            type="success"
                                            message="Link copied to clipboard"
                                            onClose={() => toast.dismiss(t.id)}
                                        />
                                    ), { position: "bottom-right" });
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="copy" viewBox="0 0 24 24" />
                                Copy link
                            </MenuItem>
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="facebook" />
                                Share on Facebook
                            </MenuItem>
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`, '_blank');
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="twitter" />
                                Share on Twitter
                            </MenuItem>
                        </MenuItems>
                    </MenuDropdown>
                ) : (
                    showComment && (
                        <button
                            className={` ml-4 cursor-pointer`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCommentOpen(!isCommentOpen);
                            }}
                        >
                            <Icon name="reply" className="icon-18 dark:fill-white" viewBox="0 0 512 512" />
                        </button>
                    )
                )}
            </div>
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
