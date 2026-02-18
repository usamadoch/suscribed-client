



"use client";
import Link from "next/link";
import Loader from "@/components/Loader";
import { useMyPage } from "@/hooks/useQueries";
// import { useHydrated } from "@/hooks/useHydrated";


import QuickActions from "./QuickActions";
import MemberActivityPanel from "./MemberActivityPanel";
import RecentPostsPanel from "./RecentPostsPanel";

// ======================
// MAIN DASHBOARD COMPONENT (CREATORS ONLY)
// ======================
const DashboardPage = () => {

    // Fetch page data
    const { data: page, isLoading: pageLoading } = useMyPage();



    // Creator page not set up yet
    if (pageLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader text="Loading..." />
            </div>
        );
    }

    if (!page) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Set up your creator page</h2>
                <Link href="/settings/profile" className="btn-purple">
                    Get Started
                </Link>
            </div>
        );
    }



    return (
        <div className="max-w-md w-full mx-auto">

            {/* Quick Actions */}
            <QuickActions pageSlug={page.pageSlug} />


            {/* Main Content - Recent Posts */}
            <RecentPostsPanel />

            {/* Sidebar - Member Activity */}
            <MemberActivityPanel page={page} />


        </div>
    );
};

export default DashboardPage;
