import Link from "next/link";
import Image from "@/components/Image";
import Images from "./Images";
import Actions from "./Actions";
import ReadMore from "@/components/ReadMore";
import { Icon } from "@/components/ui/icon";
import { Pencil, Copy, Play } from "@/lib/icons";
import ActionMenu from "@/components/ActionMenu";
import { formatDuration, formatAppDate } from "@/lib/date";
import { getCreatorInfo } from "@/lib/post-mapper";

import { Post, CreatorPage, isLockedMedia } from "@/types";

type PostCardProps = {
    post: Post;
    page?: CreatorPage;
    isOwner?: boolean;
    imageBig?: boolean;
    onCommentClick?: () => void;
};

const PostCard = ({ post, page, isOwner = false, imageBig, onCommentClick }: PostCardProps) => {
    const creator = getCreatorInfo(post, page);

    let content: string;
    let images: string[] = [];
    let video: { thumbnailUrl?: string; duration?: number } | undefined;

    if (post.isLocked) {
        content = post.teaser || 'Exclusive content for members';

        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => m.thumbnailUrl)
                .map(m => m.thumbnailUrl!)
                .filter((url): url is string => !!url);
        } else if (post.postType === 'video') {
            const attachment = post.mediaAttachments?.[0];
            if (attachment && attachment.thumbnailUrl) {
                video = {
                    thumbnailUrl: attachment.thumbnailUrl,
                    duration: (attachment as any).duration
                };
            }
        }
    } else {
        content = post.caption || '';
        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => !isLockedMedia(m) && m.url)
                .map(m => m.url)
                .filter((url): url is string => !!url);
        } else if (post.postType === 'video') {
            const attachment = post.mediaAttachments?.[0];
            if (attachment && !isLockedMedia(attachment) && attachment.url) {
                video = {
                    thumbnailUrl: attachment.thumbnailUrl,
                    duration: (attachment as any).duration
                };
            }
        }
    }

    const item = {
        id: post._id,
        author: creator.displayName,
        avatar: creator.avatarUrl,
        time: formatAppDate(post.createdAt, { suffix: true }),
        content: content,
        images: images,
        video: video,
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        isLiked: !!post.isLiked,
        isLocked: post.isLocked,
        shareUrl: `/posts/${post._id}`,
        isOwner: isOwner,
    };

    return (
        <div className="flex py-5 card bg-white border border-n-4 rounded-sm last:mb-0 mobile:px-4">
            <div className="relative shrink-0 w-8.5 h-8.5 ml-5 mobile:ml-0">
                <Image
                    className="object-cover rounded-full"
                    family="avatar"
                    slot="dropdown"
                    src={item.avatar}
                    fill
                    alt="Avatar"
                />
            </div>
            <div className="flex-1 pl-3.5 mobile:pl-3 min-w-0">
                <div className="flex items-center mr-5 mobile:mr-0">
                    <div className="flex items-center gap-2">
                        <div className="capitalize whitespace-nowrap text-base font-bold dark:text-n-9">
                            {item.author}
                        </div>
                        <div className="text-sm text-n-3 dark:text-n-8">•</div>
                        <div className="truncate text-sm font-medium text-n-3 dark:text-n-8">
                            {item.time}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {item.isOwner && (
                            <Link
                                href={`/posts/${item.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="btn-stroke btn-small rounded-full"
                            >
                                <Icon icon={Pencil} className="icon-16" /> Edit
                            </Link>
                        )}
                        <ActionMenu
                            className="-mt-1.5 -mr-2"
                            items={[
                                {
                                    label: "Copy link",
                                    icon: Copy,
                                    onClick: () => {
                                        const shareUrl = item.shareUrl;
                                        const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                        navigator.clipboard.writeText(fullUrl);

                                    },
                                }
                            ]}
                        />
                    </div>
                </div>

                <div className={`text-base py-2.5 mr-5 mobile:mr-0 ${item.isLocked ? "blur-[3px] select-none" : ""}`}>
                    <ReadMore words={100} buttonClass="text-n-1 dark:text-purple-1">{item.content}</ReadMore>
                </div>

                {item.images && item.images.length > 0 && (
                    <Images items={item.images} imageBig={imageBig} />
                )}

                {item.video && (
                    <div className="pr-5 mb-2.5 mobile:pr-0">
                        <div className={`relative aspect-video rounded-xs bg-n-2 overflow-hidden ${item.isLocked ? "blur-[3px] select-none" : ""}`}>
                            {item.video.thumbnailUrl ? (
                                <img
                                    src={item.video.thumbnailUrl}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                    <Icon icon={Play} className="w-12 h-12 text-white/80" />
                                </div>
                            )}
                            {item.video.duration && (
                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-semibold text-white dark:text-n-8">
                                    {formatDuration(item.video.duration)}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                <Actions
                    postId={item.id}
                    comments={item.comments}
                    likes={item.likes}
                    isLiked={item.isLiked}
                    shareUrl={item.shareUrl}
                    onCommentClick={onCommentClick}
                />

            </div>
        </div>
    );
};

export default PostCard;
