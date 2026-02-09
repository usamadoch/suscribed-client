"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import Layout from "@/layout";
import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { useAuth } from "@/store/auth";
import { useMyMemberships, useExploreCreators } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import { CreatorPage, User } from "@/lib/types";

// ======================
// WELCOME SECTION
// ======================
interface WelcomeSectionProps {
    user: User;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-n-1 dark:text-white mb-2">
            Welcome back, {user.displayName}!
        </h1>
        <p className="text-n-4">
            Discover new creators and stay connected with your subscriptions
        </p>
    </div>
);

// ======================
// MY SUBSCRIPTIONS PANEL
// ======================
interface SubscriptionCardProps {
    page: CreatorPage;
    joinedAt: string;
}

const SubscriptionCard = ({ page, joinedAt }: SubscriptionCardProps) => (
    <Link
        href={`/${page.pageSlug}`}
        className="block p-4 bg-n-7 dark:bg-white/5 rounded-xl hover:bg-n-6 dark:hover:bg-white/10 transition-colors"
    >
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-1/20 flex items-center justify-center overflow-hidden shrink-0">
                {page.avatarUrl ? (
                    <img src={page.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <Icon name="profile" className="w-6 h-6 fill-purple-1" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-n-1 dark:text-white truncate">
                    {page.displayName}
                </div>
                <div className="text-sm text-n-4 truncate">
                    @{page.pageSlug}
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-n-4">
                    Member since
                </div>
                <div className="text-xs text-n-3 dark:text-n-4">
                    {formatDistanceToNow(new Date(joinedAt), { addSuffix: true })}
                </div>
            </div>
        </div>
        {page.tagline && (
            <p className="mt-3 text-sm text-n-4 line-clamp-2">
                {page.tagline}
            </p>
        )}
    </Link>
);

interface MySubscriptionsPanelProps {
    memberships: Array<{
        _id: string;
        pageId: CreatorPage;
        joinedAt: string;
    }>;
}

const MySubscriptionsPanel = ({ memberships }: MySubscriptionsPanelProps) => (
    <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Icon name="team" className="w-5 h-5 fill-purple-1" />
                <h2 className="text-lg font-semibold text-n-1 dark:text-white">
                    My Subscriptions
                </h2>
            </div>
            <span className="text-sm text-n-4">
                {memberships.length} creator{memberships.length !== 1 ? 's' : ''}
            </span>
        </div>

        {memberships.length > 0 ? (
            <div className="space-y-3">
                {memberships.slice(0, 5).map((membership) => (
                    <SubscriptionCard
                        key={membership._id}
                        page={membership.pageId}
                        joinedAt={membership.joinedAt}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-8">
                <Icon name="team" className="w-12 h-12 mx-auto mb-3 fill-n-4/30" />
                <p className="text-n-4 mb-4">You haven&apos;t joined any creators yet</p>
                <Link href="/explore" className="btn-purple inline-flex items-center gap-2">
                    <Icon name="search" className="w-4 h-4" />
                    <span>Explore Creators</span>
                </Link>
            </div>
        )}

        {memberships.length > 5 && (
            <Link
                href="/subscriptions"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-1 hover:text-purple-2 transition-colors"
            >
                <span>View all subscriptions</span>
                <Icon name="arrow-next" className="w-4 h-4" />
            </Link>
        )}
    </div>
);


// ======================
// DISCOVER CREATORS PANEL
// ======================
interface DiscoverCreatorCardProps {
    page: CreatorPage;
}

const DiscoverCreatorCard = ({ page }: DiscoverCreatorCardProps) => (
    <Link
        href={`/${page.pageSlug}`}
        className="block p-4 bg-n-7 dark:bg-white/5 rounded-xl hover:bg-n-6 dark:hover:bg-white/10 transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-1/20 flex items-center justify-center overflow-hidden shrink-0">
                {page.avatarUrl ? (
                    <img src={page.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <Icon name="profile" className="w-5 h-5 fill-purple-1" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-n-1 dark:text-white truncate">
                    {page.displayName}
                </div>
                <div className="text-xs text-n-4">
                    {page.memberCount} member{page.memberCount !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    </Link>
);

interface DiscoverCreatorsPanelProps {
    creators: CreatorPage[];
}

const DiscoverCreatorsPanel = ({ creators }: DiscoverCreatorsPanelProps) => (
    <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Icon name="search" className="w-5 h-5 fill-purple-1" />
                <h2 className="text-lg font-semibold text-n-1 dark:text-white">
                    Discover Creators
                </h2>
            </div>
            <Link href="/explore" className="text-sm text-purple-1 hover:text-purple-2">
                See all
            </Link>
        </div>

        {creators.length > 0 ? (
            <div className="space-y-3">
                {creators.slice(0, 5).map((creator) => (
                    <DiscoverCreatorCard key={creator._id} page={creator} />
                ))}
            </div>
        ) : (
            <div className="text-center py-8 text-n-4">
                <p>No creators to discover right now</p>
            </div>
        )}
    </div>
);


// ======================
// QUICK STATS FOR MEMBERS
// ======================
interface QuickStatProps {
    icon: string;
    label: string;
    value: string | number;
}

const QuickStat = ({ icon, label, value }: QuickStatProps) => (
    <div className="card p-5 flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-1/10 dark:bg-purple-1/20">
            <Icon name={icon} className="w-5 h-5 fill-purple-1" />
        </div>
        <div>
            <div className="text-xl font-bold text-n-1 dark:text-white">{value}</div>
            <div className="text-sm text-n-4">{label}</div>
        </div>
    </div>
);


// ======================
// MAIN HOMEPAGE COMPONENT (MEMBERS)
// ======================
export const HomePage = () => {
    const { mounted } = useHydrated();
    const { user } = useAuth();

    // Fetch my memberships
    const { data: membershipsData, isLoading: membershipsLoading } = useMyMemberships();

    // Fetch explore creators for discovery
    const { data: exploreCreators, isLoading: creatorsLoading } = useExploreCreators();

    const isLoading = membershipsLoading || creatorsLoading;

    if (!mounted) return null;

    if (!user) {
        return (
            <Layout title="Home">
                <LoadingSpinner />
            </Layout>
        );
    }

    if (isLoading) {
        return (
            <Layout title="Home">
                <LoadingSpinner />
            </Layout>
        );
    }

    const memberships = (membershipsData || []).filter(m =>
        m.pageId && typeof m.pageId === 'object'
    ).map(m => ({
        _id: m._id,
        pageId: m.pageId as CreatorPage,
        joinedAt: m.joinedAt,
    }));

    // Filter out creators the user is already following
    const followedPageIds = new Set(memberships.map(m => m.pageId._id));
    const discoverCreators = (exploreCreators || []).filter(
        creator => !followedPageIds.has(creator._id)
    );

    return (
        <Layout title="Home">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <WelcomeSection user={user} />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <QuickStat
                        icon="team"
                        label="Subscriptions"
                        value={memberships.length}
                    />
                    <QuickStat
                        icon="notification"
                        label="New posts today"
                        value="--"
                    />
                    <QuickStat
                        icon="comments"
                        label="Unread messages"
                        value="--"
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - My Subscriptions */}
                    <div className="lg:col-span-2">
                        <MySubscriptionsPanel memberships={memberships} />
                    </div>

                    {/* Sidebar - Discover Creators */}
                    <div className="lg:col-span-1">
                        <DiscoverCreatorsPanel creators={discoverCreators} />
                    </div>
                </div>

                {/* Explore CTA */}
                {memberships.length === 0 && (
                    <div className="mt-8 text-center">
                        <div className="card p-8 bg-gradient-to-br from-purple-1/10 to-purple-2/10">
                            <Icon name="search" className="w-16 h-16 mx-auto mb-4 fill-purple-1" />
                            <h3 className="text-xl font-bold text-n-1 dark:text-white mb-2">
                                Start Your Journey
                            </h3>
                            <p className="text-n-4 mb-6 max-w-md mx-auto">
                                Explore our community of creators and find content that inspires you
                            </p>
                            <Link href="/explore" className="btn-purple inline-flex items-center gap-2">
                                <Icon name="search" className="w-4 h-4" />
                                <span>Explore Creators</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};