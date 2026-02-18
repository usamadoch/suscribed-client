import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { PostStatus } from "@/lib/types";
import { useAnalyticsPosts } from "@/hooks/useQueries";

// Explicit view model for the panel
interface RecentPostViewModel {
    _id: string;
    caption: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishedAt: string | null;
    status: PostStatus;
}

const RecentPostsPanel = () => {
    const { data: postsData, isLoading } = useAnalyticsPosts();

    const draftsCount = 0; // TODO: Fetch real draft count

    const recentPosts: RecentPostViewModel[] = (postsData?.recentPosts || []).map((p) => {
        // Enforce caption existence
        const displayCaption = p.caption || p.title || "Untitled post";

        return {
            _id: p._id,
            caption: displayCaption,
            viewCount: p.viewCount ?? 0,
            likeCount: p.likeCount ?? 0,
            commentCount: p.commentCount ?? 0,
            publishedAt: p.publishedAt,
            // Analytics endpoint currently returns only published or relevant posts
            // so we treat them as published for this view
            status: 'published',
        };
    });

    const publishedPosts = recentPosts.filter((p) => p.status === 'published');

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon name="document" className="w-5 h-5 fill-purple-1" />
                    <h3 className="font-semibold text-n-1 dark:text-white">Recent Posts</h3>
                </div>
                <Link href="/posts" className="text-sm text-purple-1 hover:text-purple-2">
                    View all
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center pt-5">
                    <Loader />
                </div>
            ) : (
                <>
                    {publishedPosts.length > 0 ? (
                        <div className="flex flex-col gap-3 py-3">
                            {publishedPosts.slice(0, 4).map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/posts/${post._id}`}
                                    className="flex items-center justify-between bg-n-7 dark:bg-white/5 rounded-xl hover:bg-n-6 dark:hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="text-sm font-medium text-n-1 dark:text-white truncate">
                                            {post.caption}
                                        </div>
                                        <div className="text-xs text-n-3 mt-1">
                                            {post.publishedAt
                                                ? formatDistanceToNow(new Date(post.publishedAt), {
                                                    addSuffix: true,
                                                })
                                                : 'Draft'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-n-4">
                                        <span className="flex text-n-2 dark:text-white items-center gap-1">
                                            <Icon name="eye" className="w-3.5 h-3.5" />
                                            {post.viewCount}
                                        </span>
                                        <span className="flex text-n-2 dark:text-white items-center gap-1">
                                            <Icon name="like" className="w-3.5 h-3.5" />
                                            {post.likeCount}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-n-4">
                            <Icon name="document" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No published posts yet</p>
                        </div>
                    )}

                    {draftsCount > 0 && (
                        <div className="border-t border-n-6 dark:border-white/10 pt-4">
                            <Link
                                href="/posts?status=draft"
                                className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-xl hover:bg-yellow-500/20 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon name="file" className="w-4 h-4 fill-yellow-500" />
                                    <span className="text-sm font-medium text-n-1 dark:text-white">
                                        {draftsCount} draft{draftsCount > 1 ? 's' : ''} pending
                                    </span>
                                </div>
                                <Icon name="arrow-next" className="w-4 h-4 fill-n-4" />
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/posts/new"
                        className="mt-4 btn-purple btn-medium w-full flex items-center justify-center gap-2"
                    >
                        <Icon name="plus" className="w-4 h-4" />
                        <span>Create New Post</span>
                    </Link>
                </>
            )}
        </div>
    );
};

export default RecentPostsPanel;
