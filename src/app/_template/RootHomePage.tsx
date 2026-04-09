





"use client";

import { useAuth } from "@/store/auth";
import { useHydrated } from "@/hooks/useHydrated";
import Loader from "@/components/Loader";
import Link from "next/link";

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
        <div className="pb-20 px-4 md:px-8 lg:px-16 w-full max-w-[1400px] mx-auto flex items-start justify-center gap-8">
            <div className="flex-1 w-full max-w-2xl">
                {isAuthenticated ? <AuthenticatedFeed /> : <PublicFeed />}
            </div>



        </div>
    );
};
