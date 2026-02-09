"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import Layout from "@/layout";
import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { RequireCreator } from "@/store/auth";
import { useMyPage, useMyMembers, useAnalyticsOverview, useAnalyticsPosts } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import { CreatorPage } from "@/lib/types";

// ======================
// STAT CARD COMPONENT
// ======================
interface StatCardProps {
    label: string;
    value: string | number;
    change?: number;
    icon: string;
}

const StatCard = ({ label, value, change, icon }: StatCardProps) => (
    <div className="card p-5 flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-1/10 dark:bg-purple-1/20">
            <Icon name={icon} className="w-6 h-6 fill-purple-1" />
        </div>
        <div className="flex-1">
            <div className="text-sm text-n-4 dark:text-n-4/80 mb-1">{label}</div>
            <div className="text-2xl font-bold text-n-1 dark:text-white">{value}</div>
        </div>
        {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <Icon name={change >= 0 ? "progress-up" : "progress-down"} className="w-4 h-4" />
                <span>{Math.abs(change)}%</span>
            </div>
        )}
    </div>
);

// ======================
// PAGE HEALTH COMPONENT
// ======================
interface PageHealthProps {
    page: CreatorPage;
}

const PageHealth = ({ page }: PageHealthProps) => {
    const checks = useMemo(() => {
        const items: { label: string; complete: boolean; action: string; href: string }[] = [
            { label: "Add a profile bio", complete: !!page.about && page.about.length > 0, action: "Add bio", href: "/settings/profile" },
            { label: "Upload an avatar", complete: !!page.avatarUrl, action: "Upload", href: "/settings/profile" },
            { label: "Upload a cover image", complete: !!page.bannerUrl, action: "Upload", href: "/settings/profile" },
            { label: "Add a tagline", complete: !!page.tagline && page.tagline.length > 0, action: "Add tagline", href: "/settings/profile" },
            { label: "Add social links", complete: page.socialLinks && page.socialLinks.length > 0, action: "Add links", href: "/settings/profile" },
            { label: "Publish your page", complete: page.status === "published", action: "Publish", href: "/settings/profile" },
        ];
        return items;
    }, [page]);

    const completedCount = checks.filter(c => c.complete).length;
    const totalCount = checks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    const incompleteItems = checks.filter(c => !c.complete);

    if (percentage === 100) return null;

    return (
        <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                    <span className="font-semibold text-n-1 dark:text-white">
                        Your page is {percentage}% complete
                    </span>
                </div>
                <span className="text-sm text-n-4">{completedCount}/{totalCount} tasks</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-n-6 dark:bg-white/10 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-1 to-purple-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Incomplete items */}
            {incompleteItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {incompleteItems.slice(0, 3).map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-n-6 dark:bg-white/5 hover:bg-n-5 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Icon name="arrow-next" className="w-3 h-3 fill-purple-1" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

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
        memberId: { _id: string; displayName: string; username: string; avatarUrl: string | null };
        status: string;
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
                <span className="text-n-4 text-sm">Total members</span>
                <span className="font-bold text-lg text-n-1 dark:text-white">{totalMembers}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-n-4 text-sm">New this week</span>
                <span className="font-medium text-green-500">+{newMembers}</span>
            </div>
        </div>

        <div className="border-t border-n-6 dark:border-white/10 pt-4">
            <h4 className="text-sm font-medium text-n-4 mb-3">Recent Activity</h4>
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
                                <div className="text-xs text-n-4">
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
        status: string;
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
                                <div className="text-xs text-n-4 mt-1">
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
const Dashboard = () => {
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

    const recentMembers = membersData?.memberships?.map(m => ({
        _id: m._id,
        memberId: m.memberId as { _id: string; displayName: string; username: string; avatarUrl: string | null },
        status: m.status,
        joinedAt: m.joinedAt,
    })) || [];

    return (
        <RequireCreator>
            <Layout title="Dashboard">
                <div className="max-w-7xl mx-auto">
                    {/* Page Health Status */}
                    <PageHealth page={page} />

                    {/* Quick Actions */}
                    <QuickActions pageSlug={page.pageSlug} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            label="Total Members"
                            value={overview?.totalMembers || page.memberCount || 0}
                            change={overview?.memberGrowth}
                            icon="team"
                        />
                        <StatCard
                            label="Total Views"
                            value={overview?.totalViews || 0}
                            change={overview?.viewGrowth}
                            icon="eye"
                        />
                        <StatCard
                            label="Total Posts"
                            value={overview?.totalPosts || page.postCount || 0}
                            icon="document"
                        />
                        <StatCard
                            label="Engagement"
                            value={`${overview?.engagementRate || 0}%`}
                            icon="chart"
                        />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Recent Posts */}
                        <div className="lg:col-span-2">
                            <RecentPostsPanel
                                posts={postsData?.recentPosts?.map(p => ({
                                    _id: p._id,
                                    caption: p.caption || p.title || null,
                                    viewCount: p.viewCount,
                                    likeCount: p.likeCount,
                                    commentCount: p.commentCount,
                                    publishedAt: p.publishedAt,
                                    status: 'published' as const,
                                })) || []}
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

export default Dashboard;
