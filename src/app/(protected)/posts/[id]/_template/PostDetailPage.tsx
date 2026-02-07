"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// import { useAuth } from "@/store/auth";

// import MediaBlock from "./_sub/MediaBlock";
// import MediaCarousel from "./_sub/MediaCarousel";
// import LockedContent from "./_sub/LockedContent";
// import CommentsSection from "./_sub/CommentsSection";

// import { usePost, usePostComments, useCheckMembership, useJoinPage } from "@/hooks/useQueries";

// import { LoadingSpinner } from "@/components/LoadingSpinner";
// import Image from "@/components/Image";

// import { getFullImageUrl } from "@/lib/utils";

// import { postApi } from "@/lib/api";
import CreatorHeader from "@/layout/CreatorHeader";


const PostDetailPage = () => {
    const params = useParams();
    // const postId = params.id as string;
    // const queryClient = useQueryClient();
    // const { user } = useAuth();

    // const { data: post, isLoading: isPostLoading } = usePost(postId);
    // const { data: comments, isLoading: isCommentsLoading } = usePostComments(postId);


    // console.log(post);
    // console.log(comments);

    // Check membership only if we have a post
    // const { data: membershipData, isLoading: isMembershipLoading } = useCheckMembership(post?.pageId || "");
    // console.log(membershipData);
    // const isMember = !!membershipData?.isMember;

    // const { mutate: joinPage, isPending: isJoining } = useJoinPage();

    // const [value, setValue] = useState("");
    // const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // const isLoading = isPostLoading || isCommentsLoading || isMembershipLoading;

    // const handleCommentSubmit = async () => {
    //     if (!value.trim()) return;

    //     setIsSubmittingComment(true);
    //     try {
    //         const { comment } = await postApi.addComment(postId, { content: value });
    //         toast.success("Comment added");
    //         setValue("");

    //         // Update cache immediately to show new comment
    //         queryClient.setQueryData(['post-comments', postId], (oldComments: any[] | undefined) => {
    //             return oldComments ? [comment, ...oldComments] : [comment];
    //         });

    //         // Invalidate/refetch comments to ensure consistency
    //         queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
    //         // Optionally update post comment count
    //         queryClient.invalidateQueries({ queryKey: ['post', postId] });
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to add comment");
    //     } finally {
    //         setIsSubmittingComment(false);
    //     }
    // };

    // Determine media to show. Prioritize attachments
    // const mediaItems = post?.mediaAttachments && post.mediaAttachments.length > 0
    //     ? post.mediaAttachments
    //     : [];

    // const isOwner = user?._id === (typeof post?.creatorId === 'object' ? post.creatorId._id : post?.creatorId);

    // const locked = (() => {
    //     if (!post) return false;
    //     if (isOwner) return false;
    //     if (post.visibility === 'public') return false;
    //     if (post.visibility === 'members' && isMember) return false;
    //     return true;
    // })();

    // const handleJoin = () => {
    //     if (!post) return;
    //     if (user) {
    //         const creatorId = typeof post.creatorId === 'object' ? post.creatorId._id : post.creatorId;
    //         joinPage({ creatorId, pageId: post.pageId }, {
    //             onSuccess: () => toast.success("Joined successfully!")
    //         });
    //     } else {
    //         setIsLoginModalOpen(true);
    //     }
    // };

    return (
        <>


            <CreatorHeader />



        </>
    );
};

export default PostDetailPage;
