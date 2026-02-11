



"use client";
import Link from "next/link";
import Loader from "@/components/Loader";

import Layout from "@/layout";

import { RequireCreator } from "@/store/auth";
import { useMyPage } from "@/hooks/useQueries";
import { useHydrated } from "@/hooks/useHydrated";


import QuickActions from "./QuickActions";
import MemberActivityPanel from "./MemberActivityPanel";
import RecentPostsPanel from "./RecentPostsPanel";

// ======================
// MAIN DASHBOARD COMPONENT (CREATORS ONLY)
// ======================
const DashboardPage = () => {
    const { mounted } = useHydrated();

    // Fetch page data
    const { data: page, isLoading: pageLoading } = useMyPage();



    if (!mounted) return null;

    // Creator page not set up yet
    if (pageLoading) {
        return (
            <RequireCreator>
                <Layout title="Dashboard">
                    <div className="flex justify-center items-center py-20">
                        <Loader text="Loading..." />
                    </div>
                </Layout>
            </RequireCreator>
        );
    }

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



    return (
        <RequireCreator>
            <Layout title="Dashboard">
                <div className="max-w-md w-full mx-auto">

                    {/* Quick Actions */}
                    <QuickActions pageSlug={page.pageSlug} />


                    {/* Main Content - Recent Posts */}
                    <RecentPostsPanel />

                    {/* Sidebar - Member Activity */}
                    <MemberActivityPanel page={page} />


                </div>
            </Layout>
        </RequireCreator>
    );
};

export default DashboardPage;
