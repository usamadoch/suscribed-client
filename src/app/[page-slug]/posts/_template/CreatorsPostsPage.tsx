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

type TabValue = "posts" | "media";

type Tab = {
    title: string;
    value: TabValue;
};

const tabs: Tab[] = [
    {
        title: "posts",
        value: "posts",
    },
    {
        title: "Media",
        value: "media",
    },
];

const CreatorsPostsPage = () => {
    const slug = usePageSlug();

    // Using cached queries
    const { data: pageData, isLoading: isLoadingPage } = useCreatorPage(slug);
    const { data: postsData, isLoading: isLoadingPosts } = useCreatorPosts(slug);

    const [activeTab, setActiveTab] = useState<TabValue>("posts");

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

    // Filter posts using the discriminated union 'postType'
    const filteredPosts = posts.filter((post: Post) => {
        if (activeTab === "media") {
            return post.postType === 'video';
        }
        // Text and Image posts
        return post.postType === 'text' || post.postType === 'image';
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
                    <div className="md:ml-auto">
                        <Tabs
                            className="mr-auto md:ml-0"
                            classButton="md:ml-0 md:flex-1"
                            items={tabs}
                            value={activeTab}
                            setValue={(value) => setActiveTab(value as TabValue)}
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {isLoadingPosts ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-n-3">No posts found in this category.</div>
                    ) : (
                        <div className={`grid ${activeTab === 'media' ? 'grid-cols-3 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1' : 'grid-cols-1'} gap-6`}>
                            {filteredPosts.map((post) => {
                                const locked = isLocked(post);

                                if (post.postType === 'video') {
                                    // It's a VideoPost, so mediaAttachments is VideoAttachment[]
                                    // But we strictly handle the array.
                                    // 'media' tab only shows videos
                                    return (
                                        <Link
                                            href={`/posts/${post._id}`}
                                            target="_blank" key={post._id}
                                            className="card"
                                        >
                                            <div className="relative aspect-video bg-n-2">
                                                {/* {locked ? (
                                                    <LockedContent type="overlay" text="Join to unlock this content" />
                                                ) : null} */}

                                                <div className="w-full h-full flex items-center justify-center bg-black">
                                                    <Icon name="video" className="w-8 h-8 fill-white/50" />
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h4 className="text-sm truncate mb-2">{post.caption}</h4>
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
                                } else {
                                    // TextPost or ImagePost
                                    // We create a strictly typed item for Review component

                                    const images = post.postType === 'image'
                                        ? post.mediaAttachments.map(m => getFullImageUrl(m.url)).filter((url): url is string => !!url)
                                        : undefined;

                                    const postItem = {
                                        id: post._id,
                                        author: page.displayName,
                                        avatar: getFullImageUrl(page.avatarUrl) || "/images/content/avatar-1.jpg",
                                        time: new Date(post.createdAt).toLocaleDateString(),
                                        content: post.caption,
                                        images: images
                                    };

                                    return (
                                        <div className="w-[calc(66.666%-1.25rem)] lg:w-full lg:mx-0 lg:mb-6" key={post._id}>
                                            <div className="relative">
                                                {/* {locked && (
                                                    <LockedContent type="overlay" text="" />
                                                )} */}
                                                <div className={locked ? "blur-sm select-none" : ""}>
                                                    <Review item={postItem} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorsPostsPage;
