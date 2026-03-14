
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Post } from "@/lib/types";
import { useAuth } from "@/store/auth";
import { useCreatorPage, useCreatorPosts, useJoinPage } from "@/hooks/useQueries";
import PostModal from "@/components/PostModal";
import LoginModal from "@/components/LoginModal";
import JoinTierModal from "@/components/JoinTierModal";
import Loader from "@/components/Loader";
import Link from "next/link";
import Icon from "@/components/Icon";
import RecentVideos from "./RecentVideos";
import CreatorPostItem from "./CreatorPostItem";

type CreatorContentProps = {
    pageSlug: string;
};

const Content = ({ pageSlug }: CreatorContentProps) => {
    // Using cached queries
    const { data: pageData } = useCreatorPage(pageSlug);
    const { data: postsData, isLoading } = useCreatorPosts(pageSlug, { type: ['text', 'image'] });
    const { isAuthenticated, user } = useAuth();
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    const { page } = pageData || {};
    const posts = postsData || [];

    const isOwner = user && page && (user._id === (typeof page.userId === 'object' ? page.userId._id : page.userId));

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const activePost = posts.find(p => p._id === selectedPostId) || null;

    const handlePostClick = (post: Post) => {
        if (!post.isLocked) {
            setSelectedPostId(post._id);
        } else {
            if (!isAuthenticated) {
                setLoginModalVisible(true);
            } else {
                setJoinModalVisible(true);
            }
        }
    };

    const handleJoin = () => {
        if (!page) return;

        const creatorId = typeof page.userId === 'object' ? page.userId._id : page.userId;
        joinPage({ creatorId, pageId: page._id }, {
            onSuccess: () => {
                toast.success("Joined successfully!");
                setJoinModalVisible(false);
            }
        });
    };

    return (
        <div className="pb-20 px-16">
            {/* <h4 className="text-h4 mb-8">Latest Posts</h4> */}

            <div className="grid grid-cols-12 lg:grid-cols-1 gap-8">
                <div className="col-span-8 lg:col-span-1 pt-10 lg:pt-0">

                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader text="Loading posts..." />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="card p-5">

                            <div className="text-center py-8 text-n-2">
                                <Icon name="document" className="w-12 h-12 mx-auto mb-3 " />
                                <p className="text-sm">No published posts yet</p>
                            </div>

                            <Link
                                href="/posts/new"
                                className="mt-4 btn-purple btn-medium w-full flex items-center justify-center gap-2"
                            >
                                <Icon name="plus" className="w-4 h-4" />
                                <span>Create New Post</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {posts.map((post: Post) => (
                                <CreatorPostItem
                                    key={post._id}
                                    post={post}
                                    page={page}
                                    isOwner={!!isOwner}
                                    onClick={handlePostClick}
                                />
                            ))}
                        </div>

                    )}
                </div>

                {/* Right Sidebar - Top Videos */}
                <div className="col-span-4 lg:col-span-1 pt-10">
                    <RecentVideos
                        pageSlug={pageSlug}
                    />
                </div>
            </div>
            <PostModal
                visible={!!activePost}
                post={activePost}
                onClose={() => setSelectedPostId(null)}
            />

            <LoginModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
            />

            {page && (
                <JoinTierModal
                    visible={joinModalVisible}
                    onClose={() => setJoinModalVisible(false)}
                    page={page}
                    onJoin={handleJoin}
                    isJoining={isJoining}
                />
            )}
        </div>
    );
};

export default Content;

