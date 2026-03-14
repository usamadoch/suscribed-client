"use client";

import { useHeader } from "@/context/HeaderContext";
import { useAuth } from "@/store/auth";
import { useMyMemberships } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";
import Loader from "@/components/Loader";

import WelcomeSection from "../_components/WelcomeSection";
import EmptySubscriptions from "../_components/EmptySubscriptions";
import HomeFeedList from "../_components/HomeFeedList";

// ======================
// MAIN HOMEPAGE COMPONENT (MEMBERS)
// ======================
export const HomePage = () => {
    useHeader({ title: "Home" });
    const { mounted } = useHydrated();
    const { user } = useAuth();

    // Fetch memberships to check if user has any
    const { data: membershipsData, isLoading: membershipsLoading } = useMyMemberships();

    if (!mounted) return null;

    if (!user || membershipsLoading) {
        return (
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    const members = (membershipsData || []).filter(m =>
        m.pageId && typeof m.pageId === 'object'
    );

    const hasSubscriptions = members.length > 0;

    return (
        <div className="pb-20 px-16">
            <div className="max-w-2xl mx-auto">
                <WelcomeSection user={user} />

                {!hasSubscriptions ? (
                    <EmptySubscriptions />
                ) : (
                    <HomeFeedList />
                )}
            </div>
        </div>
    );
};