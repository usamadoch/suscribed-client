import Actions from "@/components/Review/Actions";
import ReadMore from "@/components/ReadMore";

import PostMediaGallery from "./PostMediaGallery";
import PostMetadata from "./PostMetadata";
import ContentHeader from "@/components/ContentHeader";

import {
    Post,
    MediaAttachment,
    AnyMediaAttachment,
} from "@/types";

import { getCreatorInfo } from "@/lib/post-mapper";

// ─── Types ──────────────────────────────────────────────────

interface PostContentAreaProps {
    post: Post;
    locked: boolean;
    mediaItems: AnyMediaAttachment[];
    unlockedMediaItems: MediaAttachment[];
    displayCaption: string;
}

// ─── Component ──────────────────────────────────────────────

const PostContentArea = ({
    post,
    locked,
    mediaItems,
    unlockedMediaItems,
    displayCaption,
}: PostContentAreaProps) => {

    const creator = getCreatorInfo(post);
    return (
        <div className="w-full">
            {/* ── Media Gallery ─────────────────────────────── */}
            <PostMediaGallery
                locked={locked}
                mediaItems={mediaItems}
                unlockedMediaItems={unlockedMediaItems}
            />

            <ContentHeader
                creator={creator}
                date={post.publishedAt || post.createdAt}
                locked={locked}
                titleOrCaption={<ReadMore words={20} className="dark:text-n-9">{displayCaption}</ReadMore>}
                actions={
                    <Actions
                        postId={post._id}
                        likes={post.likeCount}
                        comments={post.commentCount}
                        isLiked={post.isLiked || false}
                        showComment={false}
                        className="mt-0"
                    />
                }
                metadata={<PostMetadata viewCount={post.viewCount} />}
            />
        </div>
    );
};

export default PostContentArea;
