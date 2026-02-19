"use client";

import Link from "next/link";

import { useHeader } from "@/context/HeaderContext";
import Icon from "@/components/Icon";

import { useAuth } from "@/store/auth";
import { useMyMemberships, useExploreCreators } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import { CreatorPage, User } from "@/lib/types";
import Loader from "@/components/Loader";

// ======================
// WELCOME SECTION
// ======================
interface WelcomeSectionProps {
    user: User;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-n-1 dark:text-white mb-2">
            Welcome, {user.displayName}!
        </h1>
        <p className="text-n-2">
            Discover new creators and stay connected with your subscriptions
        </p>
    </div>
);


interface MySubscriptionsPanelProps {
    memberships: Array<{
        _id: string;
        pageId: CreatorPage;
        joinedAt: string;
    }>;
}

const MySubscriptionsPanel = ({ memberships }: MySubscriptionsPanelProps) => (
    <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Icon name="team" className="w-5 h-5 fill-purple-1" />
                <h2 className="text-lg font-semibold text-n-1 dark:text-white">
                    My Subscriptions
                </h2>
            </div>
            <span className="text-sm text-n-2">
                {memberships.length} creator{memberships.length !== 1 ? 's' : ''}
            </span>
        </div>

        {memberships.length === 0 && (
            <div className="text-center">
                <div className="flex flex-col items-center py-3">
                    <Icon name="team" className="w-12 h-12 mx-auto mb-3 fill-n-2/30" />
                    <p className="text-n-2">You haven&apos;t joined any creators yet</p>
                </div>
                <Link href="/explore" className="btn-purple btn-medium inline-flex w-full items-center gap-2 mt-4">
                    <Icon name="search" className="w-4 h-4" />
                    <span>Explore Creators</span>
                </Link>
            </div>
        )}

    </div>
);




// ======================
// MAIN HOMEPAGE COMPONENT (MEMBERS)
// ======================
export const HomePage = () => {
    useHeader({ title: "Home" });
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
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    const memberships = (membershipsData || []).filter(m =>
        m.pageId && typeof m.pageId === 'object'
    ).map(m => ({
        _id: m._id,
        pageId: m.pageId as CreatorPage,
        joinedAt: m.joinedAt,
    }));

    return (
        <>
            <div className="max-w-md w-full mx-auto">

                {/* Welcome Section */}
                <WelcomeSection user={user} />



                <MySubscriptionsPanel memberships={memberships} />

            </div>
        </>
    );
};