
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Post, isLockedMedia } from "@/lib/types";
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
    const { data: postsData, isLoading } = useCreatorPosts(pageSlug, { type: ['text', 'image'] });
    const { isAuthenticated } = useAuth();
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    const { page } = pageData || {};
    const posts = postsData || [];



    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

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

                {isLoading ? (
                    <div className="flex items-center justify-center pt-10">
                        <Loader text="Loading posts..." />
                    </div>

                ) : posts.length === 0 ? (
                    <div className="text-n-3">No posts available.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {posts.map((post: Post) => {
                            let content: string;
                            let images: string[] = [];
                            let isLocked = post.isLocked;

                            if (post.isLocked) {
                                content = post.teaser || 'Exclusive content for members';

                                if (post.postType === 'image') {
                                    // Narrowed to LockedImagePost | UnlockedImagePost (but we are in isLocked branch)
                                    // Actually post.isLocked narrows to the Locked variant of the union.
                                    // So post.mediaAttachments are LockedImageAttachment[]
                                    const attachments = post.mediaAttachments;
                                    images = attachments
                                        .filter(m => m.thumbnailUrl)
                                        .map(m => m.thumbnailUrl!)
                                        .filter((url): url is string => !!url);
                                }
                            } else {
                                content = post.caption || '';
                                if (post.postType === 'image') {
                                    // Narrowed to UnlockedImagePost
                                    const attachments = post.mediaAttachments;
                                    images = attachments
                                        .filter(m => !isLockedMedia(m) && m.url)
                                        .map(m => m.url)
                                        .filter((url): url is string => !!url);
                                }
                            }

                            const postItem = {
                                id: post._id,
                                author: page?.displayName || "",
                                avatar: page?.avatarUrl || "/images/content/avatar-1.jpg",
                                time: new Date(post.createdAt).toLocaleDateString(),
                                content: content,
                                images: images,
                                likes: post.likeCount || 0,
                                comments: post.commentCount || 0,
                                isLiked: !!post.isLiked,
                                isLocked: isLocked,
                            };

                            // console.log(postItem);


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

