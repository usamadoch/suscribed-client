
import Link from "next/link";
import { VideoAttachment } from "@/lib/types";
import { useRecentVideos } from "@/hooks/useQueries";
import { formatAppDate, formatDuration } from "@/lib/date";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import Image from "@/components/Image";

interface RecentVideosProps {
    pageSlug: string;
}

const RecentVideos = ({ pageSlug }: RecentVideosProps) => {
    const { data: posts, isLoading } = useRecentVideos(pageSlug);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Loader text="Loading videos..." />
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="card p-5 sticky top-24 lg:static lg:top-0">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-bold flex items-center gap-2 dark:text-n-9">
                    <span>Recent Videos</span>
                </h5>
            </div>

            <div className="space-y-5">
                {posts.map((post) => {
                    const videoAttachment = post.mediaAttachments.find(m => m.type === 'video') as VideoAttachment | undefined;
                    const title = post.caption || post.teaser || "Untitled Video";
                    const date = formatAppDate(post.publishedAt || post.createdAt, { suffix: true });
                    const duration = videoAttachment?.duration ? formatDuration(videoAttachment.duration) : null;
                    const thumbnail = videoAttachment?.thumbnailUrl || "/images/content/video-placeholder.jpg";

                    return (
                        <Link
                            key={post._id}
                            href={`/posts/${post._id}`}
                            className="group cursor-pointer flex gap-3"
                        >
                            <div className="relative w-24 h-16 shrink-0 overflow-hidden bg-n-6">
                                <Image
                                    src={thumbnail}
                                    alt={title}
                                    family="post"
                                    slot="grid"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <Icon name="youtube" className="w-5 h-5 fill-white dark:fill-n-9 opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                {duration && (
                                    <div className="absolute bottom-1 right-1 px-1 bg-black/60 dark:bg-n-1/60 rounded text-[10px] text-white dark:text-n-9 font-medium">
                                        {duration}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm line-clamp-2 leading-snug dark:text-n-9">
                                    {title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-n-8">
                                    <span>{date}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

        </div>
    );
};

export default RecentVideos;
