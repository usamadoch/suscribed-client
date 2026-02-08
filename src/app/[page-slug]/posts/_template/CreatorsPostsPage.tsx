"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { useCreatorPage, useCreatorPosts } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";

import Icon from "@/components/Icon";
import Review from "@/components/Review";
import Tabs from "@/components/Tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { getFullImageUrl } from "@/lib/utils";
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

    const { page, isOwner, isMember } = pageData;
    const posts = postsData || [];

    // Filter posts: only video posts for this page
    const filteredPosts = posts.filter((post: Post) => {
        return post.postType === 'video';
    });

    const isLocked = (post: Post): boolean => {
        if (isOwner) return false;
        if (post.visibility === 'public') return false;
        if (post.visibility === 'members' && isMember) return false;
        return true;
    };

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
                                const locked = isLocked(post);

                                // It's a VideoPost
                                return (
                                    <Link
                                        href={`/posts/${post._id}`}
                                        target="_blank" key={post._id}
                                        className="card group"
                                    >
                                        <div className="relative aspect-video bg-n-2 overflow-hidden ">
                                            {/* {locked ? (
                                                <LockedContent type="overlay" text="Join to unlock this content" />
                                            ) : null} */}

                                            <div className="w-full h-full flex items-center justify-center bg-black">
                                                <Icon name="video" className="w-12 h-12 fill-white/80 group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-sm font-semibold truncate mb-2">{post.caption}</h4>
                                            <div className="flex items-center text-xs text-n-3">
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span className="mx-2">•</span>
                                                <span className="flex items-center">
                                                    <Icon name="like" className="w-3 h-3 mr-1 fill-n-3" />
                                                    {post.likeCount}
                                                </span>
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
