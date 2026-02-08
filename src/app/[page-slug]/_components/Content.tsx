"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

import { getFullImageUrl } from "@/lib/utils";
import { Post, isLockedMedia } from "@/lib/types";
import { useCreatorPage, useCreatorPosts } from "@/hooks/useQueries";
import Review from "@/components/Review";

type CreatorContentProps = {
    pageSlug: string;
};

const Content = ({ pageSlug }: CreatorContentProps) => {
    // Using cached queries
    const { data: pageData } = useCreatorPage(pageSlug);
    const { data: postsData, isLoading: isLoadingPosts } = useCreatorPosts(pageSlug);

    const { page } = pageData || {};
    const posts = postsData || [];

    // Filter posts for home page: text and image posts only
    const filteredPosts = posts.filter((post: Post) => {
        return post.postType === 'text' || post.postType === 'image';
    });

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
                        // Use the backend-provided isLocked flag
                        const locked = post.isLocked;

                        // For locked posts, use teaser or show locked message
                        // For unlocked posts, use the full content
                        const displayContent = locked
                            ? post.teaser || 'Exclusive content for members'
                            : post.caption || '';

                        // For images, handle locked state properly
                        const images = post.postType === 'image' && !locked
                            ? post.mediaAttachments
                                .filter(m => !isLockedMedia(m) && m.url)
                                .map(m => getFullImageUrl(m.url))
                                .filter((url): url is string => !!url)
                            : undefined;

                        // For locked image posts, show blurred thumbnails
                        const lockedImages = post.postType === 'image' && locked
                            ? post.mediaAttachments
                                .filter(m => m.thumbnailUrl)
                                .map(m => m.thumbnailUrl)
                                .filter((url): url is string => !!url)
                            : undefined;

                        const postItem = {
                            id: post._id,
                            author: page?.displayName || "",
                            avatar: getFullImageUrl(page?.avatarUrl) || "/images/content/avatar-1.jpg",
                            time: new Date(post.createdAt).toLocaleDateString(),
                            content: displayContent,
                            images: locked ? lockedImages : images,
                            isLocked: locked,
                        };

                        return (
                            <div className="w-full" key={post._id}>
                                <div className="relative">
                                    <Link href={`/posts/${post._id}`}>
                                        <div className={locked ? "blur-[2px] select-none pointer-events-none" : ""}>
                                            <Review item={postItem} />
                                        </div>
                                    </Link>
                                    {locked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                            <div className="text-center">
                                                <Icon name="lock" className="w-8 h-8 fill-white mb-2 mx-auto" />
                                                <p className="text-white font-medium">Members Only</p>
                                                <Link
                                                    href={`/${pageSlug}`}
                                                    className="text-sm text-accent hover:underline"
                                                >
                                                    Join to unlock
                                                </Link>
                                            </div>
                                        </div>
                                    )}
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

