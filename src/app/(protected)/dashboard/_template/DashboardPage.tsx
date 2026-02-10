



"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import Layout from "@/layout";
import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { RequireCreator } from "@/store/auth";
import { useMyPage, useMyMembers, useAnalyticsOverview, useAnalyticsPosts } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import { User, MembershipStatus, PostStatus } from "@/lib/types";

// ======================
// QUICK ACTIONS
// ======================
interface QuickActionsProps {
    pageSlug: string;
}

const QuickActions = ({ pageSlug }: QuickActionsProps) => {
    const handleCopyLink = () => {
        const url = `${window.location.origin}/${pageSlug}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="flex flex-wrap gap-3 mb-6">
            <Link
                href={`/${pageSlug}`}
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="eye" className="w-4 h-4" />
                <span>View Public Profile</span>
            </Link>
            <Link
                href="/settings/profile"
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="edit" className="w-4 h-4" />
                <span>Edit Page</span>
            </Link>
            <button
                onClick={handleCopyLink}
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="external-link" className="w-4 h-4" />
                <span>Copy Page Link</span>
            </button>
        </div>
    );
};

// ======================
// MEMBER ACTIVITY PANEL
// ======================
interface MemberActivityPanelProps {
    totalMembers: number;
    newMembers: number;
    recentMembers: Array<{
        _id: string;
        memberId: User;
        status: MembershipStatus;
        joinedAt: string;
    }>;
}

const MemberActivityPanel = ({ totalMembers, newMembers, recentMembers }: MemberActivityPanelProps) => (
    <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
            <Icon name="team" className="w-5 h-5 fill-purple-1" />
            <h3 className="font-semibold text-n-1 dark:text-white">Members</h3>
        </div>

        <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center">
                <span className=" text-sm">Total members</span>
                <span className="font-bold text-lg text-n-1 dark:text-white">{totalMembers}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className=" text-sm">New this week</span>
                <span className="font-medium text-green-500">+{newMembers}</span>
            </div>
        </div>

        <div className="border-t border-n-6 dark:border-white/10 pt-4">
            <h4 className="text-sm font-bold  mb-3">Recent Activity</h4>
            {recentMembers.length > 0 ? (
                <div className="space-y-3">
                    {recentMembers.slice(0, 5).map((member) => (
                        <div key={member._id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-1/20 flex items-center justify-center overflow-hidden">
                                {member.memberId.avatarUrl ? (
                                    <img src={member.memberId.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Icon name="profile" className="w-4 h-4 fill-purple-1" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-n-1 dark:text-white truncate">
                                    @{member.memberId.username}
                                </div>
                                <div className="text-xs text-n-3">
                                    {member.status === 'active' ? 'joined' : 'left'} • {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-n-4">No recent activity</p>
            )}
        </div>

        <Link
            href="/members"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-1 hover:text-purple-2 transition-colors"
        >
            <span>View all members</span>
            <Icon name="arrow-next" className="w-4 h-4" />
        </Link>
    </div>
);

// ======================
// RECENT POSTS PANEL
// ======================
interface RecentPostsPanelProps {
    posts: Array<{
        _id: string;
        caption: string | null;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        publishedAt: string | null;
        status: PostStatus;
    }>;
    draftsCount: number;
}

const RecentPostsPanel = ({ posts, draftsCount }: RecentPostsPanelProps) => {
    const publishedPosts = posts.filter(p => p.status === 'published');

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

            {publishedPosts.length > 0 ? (
                <div className="space-y-3 mb-4">
                    {publishedPosts.slice(0, 4).map((post) => (
                        <Link
                            key={post._id}
                            href={`/posts/${post._id}`}
                            className="flex items-center justify-between p-3 bg-n-7 dark:bg-white/5 rounded-xl hover:bg-n-6 dark:hover:bg-white/10 transition-colors"
                        >
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="text-sm font-medium text-n-1 dark:text-white truncate">
                                    {post.caption || "Untitled post"}
                                </div>
                                <div className="text-xs text-n-3 mt-1">
                                    {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-n-4">
                                <span className="flex items-center gap-1">
                                    <Icon name="eye" className="w-3.5 h-3.5" />
                                    {post.viewCount}
                                </span>
                                <span className="flex items-center gap-1">
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
                className="mt-4 btn-purple w-full flex items-center justify-center gap-2"
            >
                <Icon name="plus" className="w-4 h-4" />
                <span>Create New Post</span>
            </Link>
        </div>
    );
};


// ======================
// MAIN DASHBOARD COMPONENT (CREATORS ONLY)
// ======================
const DashboardPage = () => {
    const { mounted } = useHydrated();

    // Fetch page data
    const { data: pageData, isLoading: pageLoading } = useMyPage();
    const page = pageData;

    // Fetch analytics overview
    const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview(7);

    // Fetch recent members
    const { data: membersData, isLoading: membersLoading } = useMyMembers({ page: 1, limit: 5 });

    // Fetch recent posts
    const { data: postsData, isLoading: postsLoading } = useAnalyticsPosts();

    const isLoading = pageLoading || overviewLoading || membersLoading || postsLoading;

    if (!mounted) return null;

    if (isLoading) {
        return (
            <RequireCreator>
                <Layout title="Dashboard">
                    <LoadingSpinner />
                </Layout>
            </RequireCreator>
        );
    }

    // Creator page not set up yet
    if (!page) {
        return (
            <RequireCreator>
                <Layout title="Dashboard">
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-4">Set up your creator page</h2>
                        <Link href="/settings/profile" className="btn-purple">
                            Get Started
                        </Link>
                    </div>
                </Layout>
            </RequireCreator>
        );
    }

    // Type-safe, domain-checked mapping for members
    const recentMembers = membersData?.memberships
        ?.map(m => {
            // Guard against unpopulated members (shouldn't happen with getMyMembers but good for type safety)
            if (typeof m.memberId === 'string') return null;

            return {
                _id: m._id,
                memberId: m.memberId as User,
                status: m.status,
                joinedAt: m.joinedAt,
            };
        })
        .filter((m): m is NonNullable<typeof m> => m !== null) || [];

    // Type-safe mapping for posts
    const recentPosts = postsData?.recentPosts?.map(p => ({
        _id: p._id,
        caption: p.caption || p.title || null,
        viewCount: p.viewCount,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        publishedAt: p.publishedAt,
        status: 'published' as PostStatus, // Analytics currently returns top performing/recent published posts
    })) || [];

    return (
        <RequireCreator>
            <Layout title="Dashboard">
                <div className="max-w-7xl mx-auto">

                    {/* Quick Actions */}
                    <QuickActions pageSlug={page.pageSlug} />


                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Recent Posts */}
                        <div className="lg:col-span-2">
                            <RecentPostsPanel
                                posts={recentPosts}
                                draftsCount={0}
                            />
                        </div>

                        {/* Sidebar - Member Activity */}
                        <div className="lg:col-span-1">
                            <MemberActivityPanel
                                totalMembers={overview?.totalMembers || page.memberCount || 0}
                                newMembers={overview?.newMembers || 0}
                                recentMembers={recentMembers}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </RequireCreator>
    );
};

export default DashboardPage;
