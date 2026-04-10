import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { PostStatus } from "@/types";
import { useAnalyticsPosts } from "@/hooks/queries";

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
        <div className="card">
            <div className="flex items-center justify-between p-5">
                <h3 className="font-semibold text-n-1 dark:text-n-9">Recent Posts</h3>
                <Link href="/posts" className="text-sm text-purple-1 capitalize flex items-center ">
                    View All
                    <Icon name="arrow-next" className="icon-20 " />
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center pt-5">
                    <Loader />
                </div>
            ) : (
                <>
                    {publishedPosts.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {publishedPosts.slice(0, 4).map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/posts/${post._id}`}
                                    className=" hover:bg-n-3/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-end justify-between px-5 py-2">

                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="text-sm font-medium text-n-1 dark:text-n-9 truncate">
                                                {post.caption}
                                            </div>
                                            <div className="text-xs text-n-8 mt-1">
                                                {post.publishedAt
                                                    ? formatDistanceToNow(new Date(post.publishedAt), {
                                                        addSuffix: true,
                                                    })
                                                    : 'Draft'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-n-4">
                                            <span className="flex text-n-2 dark:text-n-9 items-center gap-1">
                                                views
                                                <strong>{post.viewCount}</strong>
                                            </span>
                                            <span className="flex text-n-2 dark:text-n-9 items-center gap-1">
                                                likes

                                                <strong>{post.likeCount}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-n-3 dark:text-n-8 fill-n-3 dark:fill-n-8">
                            <Icon name="document" className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-sm">No published posts yet</p>
                        </div>
                    )}


                    <div className="p-5">

                        <Link
                            href="/posts/new"
                            className="btn-purple btn-medium w-full flex items-center justify-center gap-2"
                        >
                            <Icon name="plus" className="w-4 h-4" />
                            <span>Create New Post</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentPostsPanel;
