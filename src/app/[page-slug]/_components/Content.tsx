"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";

// import { postApi } from "@/lib/api";
import { getFullImageUrl } from "@/lib/utils";
import { Post } from "@/lib/types";
import { useCreatorPage, useCreatorPosts } from "@/hooks/useQueries";
import Review from "@/components/Review";

type CreatorContentProps = {
    pageSlug: string;
};

const Content = ({ pageSlug }: CreatorContentProps) => {
    // Using cached queries
    const { data: pageData } = useCreatorPage(pageSlug);
    const { data: postsData, isLoading: isLoadingPosts } = useCreatorPosts(pageSlug);

    const { page, isOwner, isMember } = pageData || {};
    const posts = postsData || [];

    // Filter posts for home page: text and image posts only
    const filteredPosts = posts.filter((post: Post) => {
        return post.postType === 'text' || post.postType === 'image';
    });

    const isLocked = (post: Post): boolean => {
        if (isOwner) return false;
        if (post.visibility === 'public') return false;
        if (post.visibility === 'members' && isMember) return false;
        return true;
    };

    return (
        <div className="pb-20">
            <h4 className="px-16 text-h4 mb-8">Latest Posts</h4>

            {isLoadingPosts ? (
                <div className="px-16 text-n-3">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
                <div className="px-16 text-n-3">No posts available.</div>
            ) : (
                <div className="px-16 grid grid-cols-1 gap-6 max-w-5xl">
                    {filteredPosts.map((post) => {
                        const locked = isLocked(post);

                        // TextPost or ImagePost logic from CreatorsPostsPage
                        const images = post.postType === 'image'
                            ? post.mediaAttachments.map(m => getFullImageUrl(m.url)).filter((url): url is string => !!url)
                            : undefined;

                        const postItem = {
                            id: post._id,
                            author: page?.displayName || "",
                            avatar: getFullImageUrl(page?.avatarUrl) || "/images/content/avatar-1.jpg",
                            time: new Date(post.createdAt).toLocaleDateString(),
                            content: post.caption,
                            images: images
                        };

                        return (
                            <div className="w-full" key={post._id}>
                                <div className="relative">
                                    <div className={locked ? "blur-sm select-none" : ""}>
                                        <Review item={postItem} />
                                    </div>
                                    {/* Locked overlay could be added here if needed */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Content;
