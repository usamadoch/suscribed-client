import Link from "next/link";
import Image from "@/components/Image";
import Images from "./Images";
import Actions from "./Actions";
import ReadMore from "@/components/ReadMore";
import Icon from "../Icon";
import ActionMenu from "@/components/ActionMenu";
import { formatDuration } from "@/lib/date";

import { ReviewItem } from "@/types";

type ReviewProps = {
    item: ReviewItem;
    imageBig?: boolean;
    onCommentClick?: () => void;
};

const Review = ({ item, imageBig, onCommentClick }: ReviewProps) => {
    return (
        <div className="flex py-5 card bg-white border border-n-4 rounded-sm last:mb-0">
            <div className="relative shrink-0 w-8.5 h-8.5 ml-5">
                <Image
                    className="object-cover rounded-full"
                    family="avatar"
                    slot="dropdown"
                    src={item.avatar}
                    fill
                    alt="Avatar"
                />
            </div>
            <div className="w-[calc(100%-2.125rem)] pl-3.5">
                <div className="flex items-center mr-5">
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
                                className="btn-stroke btn-small"
                            >
                                <Icon name="edit" viewBox="0 0 24 24" /> Edit
                            </Link>
                        )}
                        <ActionMenu
                            className="-mt-1.5 -mr-2"
                            items={[
                                {
                                    label: "Copy link",
                                    icon: "copy",
                                    onClick: () => {
                                        const shareUrl = item.shareUrl;
                                        const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                        navigator.clipboard.writeText(fullUrl);

                                    },
                                    viewBox: "0 0 24 24",
                                }
                            ]}
                        />
                    </div>
                </div>

                <div className={`text-base py-2.5 ${item.isLocked ? "blur-[3px] select-none" : ""}`}>
                    <ReadMore words={100} buttonClass="text-n-1 dark:text-purple-1">{item.content}</ReadMore>
                </div>

                {item.images && item.images.length > 0 && (
                    <Images items={item.images} imageBig={imageBig} />
                )}

                {item.video && (
                    <div className={`relative aspect-video bg-n-2 overflow-hidden mb-4 ${item.isLocked ? "blur-[3px] select-none" : ""}`}>
                        {item.video.thumbnailUrl ? (
                            <img
                                src={item.video.thumbnailUrl}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <Icon name="play" className="w-12 h-12 fill-white/80" />
                            </div>
                        )}
                        {item.video.duration && (
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-semibold text-white dark:text-n-8">
                                {formatDuration(item.video.duration)}
                            </div>
                        )}
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

export default Review;
