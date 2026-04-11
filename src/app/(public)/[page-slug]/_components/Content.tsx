
import { useEffect, useState } from "react";

import { Post } from "@/types";
import { useAuth } from "@/store/auth";
import { useCreatorPage, useCreatorPosts } from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import PostModal from "@/components/modals/PostModal";
import LoginModal from "@/components/modals/LoginModal";
import JoinTierModal from "@/components/modals/JoinTierModal";
import Loader from "@/components/Loader";
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
    const queryClient = useQueryClient();

    const { page } = pageData || {};
    const posts = postsData || [];

    const isOwner = user && page && (user._id === (typeof page.userId === 'object' ? page.userId._id : page.userId));

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    // Persist modal open state on refresh
    const slug = page?.pageSlug || pageSlug;
    useEffect(() => {
        const wasOpen = sessionStorage.getItem(`join_modal_open_${slug}`);
        if (wasOpen === 'true' && isAuthenticated) {
            setJoinModalVisible(true);
        }
    }, [slug, isAuthenticated]);

    const activePost = posts.find(p => p._id === selectedPostId) || null;

    const handleOpenJoinModal = () => {
        setJoinModalVisible(true);
        sessionStorage.setItem(`join_modal_open_${slug}`, 'true');
    };

    const handleCloseJoinModal = () => {
        setJoinModalVisible(false);
        sessionStorage.removeItem(`join_modal_open_${slug}`);
    };

    const handlePostClick = (post: Post) => {
        if (!post.isLocked) {
            setSelectedPostId(post._id);
        } else {
            if (!isAuthenticated) {
                setLoginModalVisible(true);
            } else {
                handleOpenJoinModal();
            }
        }
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
                    ) : (

                        <div className="grid grid-cols-1 gap-5">
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
                page={page}
                onClose={() => setSelectedPostId(null)}
            />

            <LoginModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
            />

            {page && (
                <JoinTierModal
                    visible={joinModalVisible}
                    onClose={handleCloseJoinModal}
                    page={page}
                    onSubscriptionSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['creator-posts', pageSlug], refetchType: 'all' });
                        queryClient.invalidateQueries({ queryKey: ['creator-page', pageSlug], refetchType: 'all' });
                        queryClient.invalidateQueries({ queryKey: ['recent-videos', pageSlug], refetchType: 'all' });
                    }}
                />
            )}
        </div>
    );
};

export default Content;

