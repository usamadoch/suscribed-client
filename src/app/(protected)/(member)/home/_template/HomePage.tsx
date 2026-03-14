"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useHeader } from "@/context/HeaderContext";

import { useAuth } from "@/store/auth";
import { useMyMemberships, useHomeFeed } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import { Post } from "@/lib/types";
import Loader from "@/components/Loader";
import PostModal from "@/components/PostModal";

import WelcomeSection from "../_components/WelcomeSection";
import EmptySubscriptions from "../_components/EmptySubscriptions";
import CaughtUpMessage from "../_components/CaughtUpMessage";
import FeedItem from "../_components/FeedItem";

// ======================
// MAIN HOMEPAGE COMPONENT (MEMBERS)
// ======================
export const HomePage = () => {
    useHeader({ title: "Home" });
    const { mounted } = useHydrated();
    const { user } = useAuth();

    // Fetch memberships to check if user has any
    const { data: membershipsData, isLoading: membershipsLoading } = useMyMemberships();

    // Fetch home feed (infinite scrolling)
    const {
        data: feedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: feedLoading,
    } = useHomeFeed();

    // Post modal state
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Sentinel ref for infinite scroll
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Flatten all pages of posts into a single array
    const allPosts: Post[] = feedData?.pages.flatMap(page => page.posts) ?? [];

    // Find the active post for the modal
    const activePost = allPosts.find(p => p._id === selectedPostId) || null;

    const handlePostClick = (post: Post) => {
        if (!post.isLocked) {
            setSelectedPostId(post._id);
        }
    };

    // Intersection Observer for infinite scroll
    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: "200px",
        });
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [observerCallback]);

    if (!mounted) return null;

    if (!user) {
        return (
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    if (membershipsLoading) {
        return (
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    const members = (membershipsData || []).filter(m =>
        m.pageId && typeof m.pageId === 'object'
    );

    const hasSubscriptions = members.length > 0;

    return (
        <>
            <div className="pb-20 px-16">

                <div className="max-w-2xl mx-auto">

                    {/* Welcome Section */}
                    <WelcomeSection user={user} />

                    {/* No subscriptions */}
                    {!hasSubscriptions && <EmptySubscriptions />}

                    {/* Feed */}
                    {hasSubscriptions && (
                        <>
                            {feedLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader text="Loading your feed..." />
                                </div>
                            ) : allPosts.length === 0 ? (
                                <CaughtUpMessage />
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {allPosts.map((post: Post) => (
                                        <FeedItem
                                            key={post._id}
                                            post={post}
                                            onClick={handlePostClick}
                                        />
                                    ))}

                                    {/* Infinite scroll sentinel */}
                                    <div ref={sentinelRef} className="h-1" />

                                    {/* Loading more */}
                                    {isFetchingNextPage && (
                                        <div className="flex justify-center py-6">
                                            <Loader text="Loading more posts..." />
                                        </div>
                                    )}

                                    {/* End of feed */}
                                    {!hasNextPage && allPosts.length > 0 && !isFetchingNextPage && (
                                        <CaughtUpMessage />
                                    )}
                                </div>
                            )}
                        </>
                    )}

                </div>

            </div>

            {/* Post Modal */}
            <PostModal
                visible={!!activePost}
                post={activePost}
                onClose={() => setSelectedPostId(null)}
            />
        </>
    );
};