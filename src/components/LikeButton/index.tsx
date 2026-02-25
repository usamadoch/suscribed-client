import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { postApi } from "@/lib/api";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/LoginModal";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialIsLiked: boolean;
}

const LikeButton = ({ postId, initialLikes, initialIsLiked }: LikeButtonProps) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    const [liked, setLiked] = useState<boolean>(initialIsLiked);
    const [likesCount, setLikesCount] = useState<number>(initialLikes);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);

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
                <span className="text-xs">{likesCount}</span>
            </button>
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

export default LikeButton;
