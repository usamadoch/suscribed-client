import Image from "@/components/Image";
import Actions from "@/components/Review/Actions";
import ReadMore from "@/components/ReadMore";

import PostMediaGallery from "./PostMediaGallery";
import PostMetadata from "./PostMetadata";

import {
    Post,
    MediaAttachment,
    AnyMediaAttachment,
} from "@/types";

import { formatAppDate } from "@/lib/date";
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

            {/* ── Caption, Actions, Metadata ───────────────── */}
            <div className="max-w-4xl mx-auto p-5 pt-0">
                <div className="flex flex-col items-start justify-between w-full">
                    <div className="flex items-start w-full">
                        {/* Avatar Section */}
                        <div className="relative shrink-0 w-16 h-16 mb-3 rounded-full shadow-primary-4 bg-n-1">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    className="object-cover"
                                    slot="profile"
                                    family="avatar"
                                    src={creator.avatarUrl}
                                    fill
                                    alt={creator.displayName}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full pl-4 gap-2">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <h5 className="capitalize text-h5 md:text-h4 dark:text-n-9">{creator.displayName}</h5>
                                    <div className="flex items-center gap-3 ">
                                        <span className="dark:text-n-8">•</span>
                                        <span className="text-sm text-n-3 dark:text-n-8">
                                            {formatAppDate(post.publishedAt || post.createdAt, { suffix: true })}
                                        </span>
                                    </div>
                                </div>
                                <Actions
                                    postId={post._id}
                                    likes={post.likeCount}
                                    comments={post.commentCount}
                                    isLiked={post.isLiked || false}
                                    showComment={false}
                                    className="mt-0 ml-auto mobile:hidden"
                                />
                            </div>

                            <div className="flex justify-between items-start w-full">
                                <div className={`text-sm whitespace-pre-wrap text-n-1 dark:text-n-9 w-[60%] ${locked ? "blur-xs select-none" : ""}`}>
                                    <ReadMore words={20} className="dark:text-n-9">{displayCaption}</ReadMore>
                                </div>
                                <div className="shrink-0 mobile:hidden">
                                    <PostMetadata viewCount={post.viewCount} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className=" hidden mobile:flex pt-4 justify-between items-center w-full">
                        <div className="flex items-center gap-3 ml-2">
                            <Actions
                                postId={post._id}
                                likes={post.likeCount}
                                comments={post.commentCount}
                                isLiked={post.isLiked || false}
                                showComment={false}
                                className="mt-0"
                            />
                        </div>
                        <div className="shrink-0">
                            <PostMetadata viewCount={post.viewCount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostContentArea;
