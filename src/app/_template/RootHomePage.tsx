





"use client";

import { useAuth } from "@/store/auth";
import { useHydrated } from "@/hooks/useHydrated";
import Loader from "@/components/Loader";

import AuthenticatedFeed from "./AuthenticatedFeed";
import PublicFeed from "./PublicFeed";


// ======================
// ROOT HOMEPAGE (PUBLIC + AUTHENTICATED)
// ======================
export const RootHomePage = () => {
    const { mounted } = useHydrated();
    const { isAuthenticated, isLoading } = useAuth();

    if (!mounted) return null;

    // While auth is loading, show a loader briefly
    if (isLoading) {
        return (
            <div className="flex justify-center items-center pt-10">
                <Loader />
            </div>
        );
    }

    return (
        <div className="pb-20 px-16">
            <div className="max-w-2xl mx-auto">
                {isAuthenticated ? <AuthenticatedFeed /> : <PublicFeed />}
            </div>
        </div>
    );
};
