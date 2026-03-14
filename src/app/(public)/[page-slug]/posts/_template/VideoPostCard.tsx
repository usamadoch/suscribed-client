import Link from "next/link";
import Icon from "@/components/Icon";
import ReadMore from "@/components/ReadMore";
import { formatAppDate, formatDuration } from "@/lib/date";
import { VideoPost } from "@/lib/types";

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
            className="card group"
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
            <div className="p-5">
                <p className={`text-sm font-semibold mb-2 ${isLocked ? "blur-xs select-none" : ""}`}>
                    <ReadMore words={12}>{displayCaption}</ReadMore>
                </p>
                <div className="flex items-center text-xs text-n-3">
                    <span>{formatAppDate(post.createdAt, { suffix: true })}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                        {post.viewCount} views
                    </span>
                    {isLocked && (
                        <>
                            <span className="mx-2">•</span>
                            <span className="flex items-center text-accent">
                                <Icon name="lock" className="w-3 h-3 mr-1 fill-accent" />
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
