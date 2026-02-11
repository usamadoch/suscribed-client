"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { useCreatorPage, useCreatorPosts } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";

import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import CreatorHeader from "@/layout/CreatorHeader";
import { Post } from "@/lib/types";


const CreatorsPostsPage = () => {
    const slug = usePageSlug();

    // Using cached queries
    const { data: pageData, isLoading: isLoadingPage } = useCreatorPage(slug);
    const { data: postsData, isLoading: isLoadingPosts } = useCreatorPosts(slug);

    if (isLoadingPage) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!pageData || !pageData.page) {
        notFound();
    }

    const { page } = pageData;
    const posts = postsData || [];

    // Filter posts: only video posts for this page
    const filteredPosts = posts.filter((post: Post) => {
        return post.postType === 'video';
    });

    return (
        <>
            <CreatorHeader />
            <div className="max-w-[90rem] mx-auto px-6 2xl:px-8 lg:px-6 md:px-5 pt-24 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-h3">Posts</h1>
                </div>

                <div className="grid gap-6">
                    {isLoadingPosts ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-n-3">No video posts found.</div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => {
                                // Use the backend-provided isLocked flag
                                const locked = post.isLocked;

                                // Get thumbnail URL (blurred for locked, normal for unlocked)
                                const thumbnailUrl = post.mediaAttachments[0]?.thumbnailUrl;

                                // Display content: teaser for locked, caption for unlocked
                                const displayCaption = locked
                                    ? post.teaser || 'Exclusive content'
                                    : post.caption || 'Untitled video';

                                return (
                                    <Link
                                        href={`/posts/${post._id}`}
                                        key={post._id}
                                        className="card group"
                                    >
                                        <div className="relative aspect-video bg-n-2 overflow-hidden">
                                            {/* Video thumbnail or placeholder */}
                                            {thumbnailUrl ? (
                                                <img
                                                    src={thumbnailUrl}
                                                    alt={displayCaption}
                                                    className={`w-full h-full object-cover `}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-black">
                                                    <Icon name="video" className="w-12 h-12 fill-white/80 group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                            )}

                                            {/* Locked overlay */}
                                            {/* {locked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <div className="text-center">
                                                        <Icon name="lock" className="w-8 h-8 fill-white mb-2 mx-auto" />
                                                        <p className="text-white text-sm font-medium">Members Only</p>
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* Play button overlay for unlocked videos */}
                                            {/* {!locked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Icon name="play" className="w-12 h-12 fill-white" />
                                                </div>
                                            )} */}
                                        </div>
                                        <div className="p-5">
                                            <h4 className={`text-sm font-semibold truncate mb-2 ${locked ? "blur-xs select-none" : ""}`}>
                                                {displayCaption}
                                            </h4>
                                            <div className="flex items-center text-xs text-n-3">
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span className="mx-2">•</span>
                                                <span className="flex items-center">
                                                    <Icon name="like" className="w-3 h-3 mr-1 fill-n-3" />
                                                    {post.likeCount}
                                                </span>
                                                {locked && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <span className="flex items-center text-accent">
                                                            <Icon name="lock" className="w-3 h-3 mr-1 fill-accent" />
                                                            Locked
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorsPostsPage;

