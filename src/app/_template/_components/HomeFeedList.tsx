import { useState } from "react";
import { useHomeFeed } from "@/hooks/queries";
import { Post } from "@/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Loader from "@/components/Loader";
import PostModal from "@/components/modals/PostModal";

import CaughtUpMessage from "./CaughtUpMessage";
import FeedItem from "./FeedItem";

export default function HomeFeedList() {
    const {
        data: feedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: feedLoading,
    } = useHomeFeed();

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const { sentinelRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const allPosts: Post[] = feedData?.pages.flatMap(page => page.posts) ?? [];
    const activePost = allPosts.find(p => p._id === selectedPostId) || null;

    const handlePostClick = (post: Post) => {
        if (!post.isLocked) {
            setSelectedPostId(post._id);
        }
    };

    if (feedLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader text="Loading your feed..." />
            </div>
        );
    }

    if (allPosts.length === 0) {
        return <CaughtUpMessage />;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                {allPosts.map((post: Post) => (
                    <FeedItem
                        key={post._id}
                        post={post}
                        onClick={handlePostClick}
                    />
                ))}

                <div ref={sentinelRef} className="h-1" />

                {isFetchingNextPage && (
                    <div className="flex justify-center py-6">
                        <Loader text="Loading more posts..." />
                    </div>
                )}

                {!hasNextPage && allPosts.length > 0 && !isFetchingNextPage && (
                    <CaughtUpMessage />
                )}
            </div>

            <PostModal
                visible={!!activePost}
                post={activePost}
                onClose={() => setSelectedPostId(null)}
            />
        </>
    );
}
