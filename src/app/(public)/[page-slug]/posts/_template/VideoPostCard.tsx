import Link from "next/link";
import Icon from "@/components/Icon";
import ReadMore from "@/components/ReadMore";
import { formatAppDate, formatDuration } from "@/lib/date";
import { VideoPost } from "@/types";

interface VideoPostCardProps {
    post: VideoPost;
}

const VideoPostCard = ({ post }: VideoPostCardProps) => {
    // Strict narrowing for VideoPost
    const isLocked = post.isLocked;
    // In a VideoPost, mediaAttachments should be present.
    // We access the first one which is the main video.
    const video = post.mediaAttachments?.[0];

    let displayCaption: string;
    let thumbnailUrl: string | undefined = video?.thumbnailUrl;
    const duration = video?.duration;

    if (post.isLocked) {
        displayCaption = post.teaser || "Members Only";
    } else {
        displayCaption = post.caption || "Untitled video";
    }

    return (
        <Link
            href={`/posts/${post._id}`}
            className="card group dark:bg-n-1 border-none"
        >
            <div className="relative aspect-video bg-n-2 overflow-hidden">
                {/* Video thumbnail or placeholder */}
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={displayCaption}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <Icon name="video" className="w-12 h-12 fill-white/80 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                )}

                {duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-semibold text-white">
                        {formatDuration(duration)}
                    </div>
                )}
            </div>
            <div className="py-5">
                <p className={`text-sm font-semibold mb-2 ${isLocked ? "blur-xs select-none" : ""}`}>
                    <ReadMore
                        words={12}
                        blurClass="bg-linear-to-r from-transparent to-white dark:to-n-1"
                    >
                        {displayCaption}
                    </ReadMore>
                </p>
                <div className="flex items-center text-xs text-n-3 dark:text-n-8">
                    <span>{formatAppDate(post.createdAt, { suffix: true })}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                        {post.viewCount} views
                    </span>
                    {isLocked && (
                        <>
                            <span className="mx-2 dark:text-n-8">•</span>
                            <span className="flex items-center text-accent dark:text-n-9">
                                <Icon name="lock" className="w-3 h-3 mr-1 fill-accent dark:fill-n-9" />
                                Locked
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default VideoPostCard;
