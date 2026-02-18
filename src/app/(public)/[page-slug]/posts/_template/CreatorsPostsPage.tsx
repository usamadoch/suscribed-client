"use client";

import Link from "next/link";
import { useCreatorPosts } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";
import { formatAppDate, formatDuration } from "@/lib/date";

import Icon from "@/components/Icon";

// import CreatorHeader from "@/layout/CreatorHeader";
import { Post, VideoPost } from "@/lib/types";
import Loader from "@/components/Loader";
import ReadMore from "@/components/ReadMore";


const CreatorsPostsPage = () => {
    const slug = usePageSlug();

    const { data: postsData, isLoading } = useCreatorPosts(slug, { type: 'video' });

    const posts = (postsData || []) as VideoPost[];

    // Filter posts: only video posts for this page

    return (
        <>
            {/* CreatorHeader removed from here, now in layout */}
            <div className="max-w-360 mx-auto px-6 2xl:px-8 lg:px-6 md:px-5 pt-24 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-h3">Posts</h1>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-n-3">No video posts found.</div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {posts.map((post) => {

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
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorsPostsPage;

