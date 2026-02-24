import Image from "@/components/Image";
import Actions from "@/components/Review/Actions";

import MediaBlock from "./MediaBlock";
import MediaCarousel from "./MediaCarousel";
import LockedContent from "./LockedContent";
import ReadMore from "@/components/ReadMore";

import {
    Post,
    MediaAttachment,
    AnyMediaAttachment,
} from "@/lib/types";

import { formatAppDate } from "@/lib/date";

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

    const page = typeof post.pageId === 'object' ? post.pageId : null;

    const displayName = page?.displayName || "Member";
    return (
        <div className="w-full">
            {/* ── Media Gallery ─────────────────────────────── */}
            <PostMediaGallery
                locked={locked}
                mediaItems={mediaItems}
                unlockedMediaItems={unlockedMediaItems}
            />

            {/* ── Caption, Actions, Metadata ───────────────── */}
            <div className="max-w-4xl mx-auto p-5 pt-0">



                <div className="flex items-start justify-between w-full">
                    <div className="flex items-start w-full">
                        {/* Avatar Section */}

                        <div className="relative shrink-0 w-16 h-16 mb-3 rounded-full shadow-primary-4 bg-n-1">

                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    className="object-cover"
                                    slot="profile"
                                    family="avatar"
                                    src={page?.avatarUrl}
                                    fill
                                    alt={displayName}

                                />
                            </div>

                        </div>

                        <div className="flex flex-col w-full pl-4 gap-2">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <h5 className="text-h5 md:text-h4">{displayName}</h5>
                                    <span>•</span>
                                    <span className="text-sm text-n-3">
                                        {formatAppDate(post.publishedAt || post.createdAt, { suffix: true })}
                                    </span>
                                </div>
                                <Actions
                                    postId={post._id}
                                    likes={post.likeCount}
                                    comments={post.commentCount}
                                    isLiked={post.isLiked || false}
                                    showComment={false}
                                    className="mt-0 ml-auto"
                                />
                            </div>

                            <div className="flex justify-between items-start w-full">
                                <div className={`text-sm whitespace-pre-wrap text-n-1 dark:text-white w-[60%] ${locked ? "blur-xs select-none" : ""}`}>
                                    <ReadMore words={20}>{displayCaption}</ReadMore>
                                </div>
                                <div className="shrink-0">
                                    <PostMetadata viewCount={post.viewCount} />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

// ─── Sub-components ─────────────────────────────────────────

interface PostMediaGalleryProps {
    locked: boolean;
    mediaItems: AnyMediaAttachment[];
    unlockedMediaItems: MediaAttachment[];
}

const PostMediaGallery = ({
    locked,
    mediaItems,
    unlockedMediaItems,
}: PostMediaGalleryProps) => {
    if (mediaItems.length === 0) return null;

    if (locked) {
        return (
            <div className="relative w-full h-[512px] bg-n-2 mb-6 overflow-hidden">
                <LockedContent
                    type="overlay"
                    text="Join to unlock this content"
                />
                <Image
                    className="object-contain"
                    src={mediaItems[0].thumbnailUrl || "/images/img-1.jpg"}
                    fill
                    alt="Locked content preview"
                    unoptimized
                />
            </div>
        );
    }

    if (unlockedMediaItems.length > 1) {
        return <MediaCarousel items={unlockedMediaItems} />;
    }

    return (
        <>
            {unlockedMediaItems.map((media: MediaAttachment, index: number) => (
                <MediaBlock key={index} media={media} className="mb-4" />
            ))}
        </>
    );
};

interface PostMetadataProps {
    viewCount: number;
}

const PostMetadata = ({ viewCount }: PostMetadataProps) => (
    <div className="flex gap-3 justify-end items-center text-sm text-n-3">

        <div className="flex gap-1">
            <strong className="text-purple-1">{viewCount}</strong> views
        </div>


    </div>
);

export default PostContentArea;
