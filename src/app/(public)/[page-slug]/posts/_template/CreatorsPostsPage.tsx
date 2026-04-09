"use client";

import { useState } from "react";
import { useCreatorPosts } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";
import { VideoPost } from "@/lib/types";

import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import Select from "@/components/Select";

import VideoPostCard from "./VideoPostCard";

const SORT_OPTIONS = [
    { id: "recent", title: "Recent" },
    { id: "popular", title: "Popular" },
    { id: "old", title: "Old" },
];

const sortPosts = (posts: VideoPost[], sortId: string) => {
    return [...posts].sort((a, b) => {
        if (sortId === "recent") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortId === "popular") {
            return (b.viewCount || 0) - (a.viewCount || 0);
        }
        if (sortId === "old") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
    });
};

const CreatorsPostsPage = () => {
    const slug = usePageSlug();

    const { data: postsData, isLoading } = useCreatorPosts(slug, { type: 'video' });
    const posts = (postsData || []) as VideoPost[];

    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);

    const sortedPosts = sortPosts(posts, sortOption.id);

    return (
        <div className="max-w-360 mx-auto px-6 2xl:px-8 lg:px-6 md:px-5">
            <div className="grid gap-6 pt-10">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Loader />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex items-center justify-center">
                        <div className="text-center py-10 text-n-8">No video posts found.</div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-end items-center gap-4 mb-6">
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-9 px-4 bg-white border border-n-1 text-sm text-n-1 font-bold outline-none transition-colors placeholder:font-normal dark:bg-[#1f1f1f] dark:border-n-6 dark:text-n-9 dark:placeholder:text-n-9/75"
                                />
                                <Icon
                                    name="search"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 icon-20 fill-n-1 dark:fill-n-9"
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
                            {sortedPosts.map((post) => (
                                <VideoPostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorsPostsPage;

