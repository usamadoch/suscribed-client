
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";

import { getFullImageUrl } from "@/lib/utils";
import { Post, isLockedMedia, CreatorPage } from "@/lib/types";
import { useAuth } from "@/store/auth";
import { useCreatorPage, useCreatorPosts, useJoinPage } from "@/hooks/useQueries";
import Review from "@/components/Review";
import PostModal from "@/components/PostModal";
import LoginModal from "@/components/LoginModal";
import JoinMembershipModal from "@/components/JoinMembershipModal";
import Loader from "@/components/Loader";

type CreatorContentProps = {
    pageSlug: string;
};

const Content = ({ pageSlug }: CreatorContentProps) => {
    // Using cached queries
    const { data: pageData } = useCreatorPage(pageSlug);
    const { data: postsData, isLoading: isLoadingPosts } = useCreatorPosts(pageSlug);
    const { isAuthenticated } = useAuth();
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    const { page } = pageData || {};
    const posts = postsData || [];

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    // Filter posts for home page: text and image posts only
    const filteredPosts = posts.filter((post: Post) => {
        return post.postType === 'text' || post.postType === 'image';
    });

    const handlePostClick = (post: Post) => {
        if (!post.isLocked) {
            setSelectedPost(post);
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
            <h4 className="text-h4 mb-8">Latest Posts</h4>

            <div className="max-w-5xl">

                {isLoadingPosts ? (
                    <div className="flex items-center justify-center pt-10">
                        <Loader text="Loading posts..." />
                    </div>

                ) : filteredPosts.length === 0 ? (
                    <div className="text-n-3">No posts available.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
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
                                likes: post.likeCount || 0,
                                comments: post.commentCount || 0,
                                isLiked: !!post.isLiked,
                                isLocked: locked,
                            };

                            return (
                                <div className="w-full" key={post._id}>
                                    <div className="relative">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => handlePostClick(post)}
                                        >
                                            <Review item={postItem} />
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>



            <PostModal
                visible={!!selectedPost}
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
            />

            <LoginModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
            />

            {page && (
                <JoinMembershipModal
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

