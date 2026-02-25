"use client";

import { useState } from "react";
import Link from "next/link";
import { useCreatorPosts } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";
import { formatAppDate, formatDuration } from "@/lib/date";

import Icon from "@/components/Icon";

// import CreatorHeader from "@/layout/CreatorHeader";
import { VideoPost } from "@/lib/types";
import Loader from "@/components/Loader";
import ReadMore from "@/components/ReadMore";
import Select from "@/components/Select";

const SORT_OPTIONS = [
    { id: "recent", title: "Recent" },
    { id: "popular", title: "Popular" },
    { id: "old", title: "Old" },
];

const CreatorsPostsPage = () => {
    const slug = usePageSlug();

    const { data: postsData, isLoading } = useCreatorPosts(slug, { type: 'video' });

    const posts = (postsData || []) as VideoPost[];

    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption.id === "recent") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption.id === "popular") {
            return (b.viewCount || 0) - (a.viewCount || 0);
        }
        if (sortOption.id === "old") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
    });

    // Filter posts: only video posts for this page

    return (
        <>
            {/* CreatorHeader removed from here, now in layout */}
            <div className="max-w-360 mx-auto px-6 2xl:px-8 lg:px-6 md:px-5">



                <div className="grid gap-6 pt-10">
                    {isLoading ? (
                        <div className="flex items-center justify-center ">
                            <Loader />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex items-center justify-center ">

                            <div className="text-center py-10 text-n-3">No video posts found.</div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-end items-center gap-4 mb-6">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full h-9 px-4 bg-white border border-n-1 text-sm text-n-1 font-bold outline-none transition-colors placeholder:font-normal dark:bg-n-1 dark:border-white dark:text-white dark:placeholder:text-white/75"
                                    />
                                    <Icon
                                        name="search"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 icon-20 fill-n-1 dark:fill-white"
                                    />
                                </div>
                                <div className="w-40 md:w-48 z-10 ">
                                    <Select
                                        items={SORT_OPTIONS}
                                        value={sortOption}
                                        onChange={setSortOption}
                                        classButton="h-9"
                                        classOption="h-9"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {sortedPosts.map((post) => {

                                    // Strict narrowing for VideoPost
                                    const isLocked = post.isLocked;
                                    // In a VideoPost, mediaAttachments should be present.
                                    // We access the first one which is the main video.
                                    const video = post.mediaAttachments[0];

                                    let displayCaption: string;
                                    let thumbnailUrl: string | undefined = video?.thumbnailUrl;
                                    const duration = video?.duration;

                                    if (post.isLocked) {
                                        displayCaption = post.teaser;
                                    } else {
                                        displayCaption = post.caption || 'Untitled video';
                                    }

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

                                                {duration && (
                                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-semibold text-white">
                                                        {formatDuration(duration)}
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
                                                <p className={`text-sm font-semibold mb-2 ${isLocked ? "blur-xs select-none" : ""}`}>
                                                    <ReadMore words={12}>{displayCaption}</ReadMore>
                                                </p>
                                                <div className="flex items-center text-xs text-n-3">
                                                    <span>{formatAppDate(post.createdAt, { suffix: true })}</span>
                                                    <span className="mx-2">•</span>
                                                    <span className="flex items-center">
                                                        {post.viewCount} views
                                                    </span>
                                                    {isLocked && (
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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorsPostsPage;

