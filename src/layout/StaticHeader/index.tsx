"use client";

import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/auth";

const StaticHeader = () => {
    const [headerStyle, setHeaderStyle] = useState<boolean>(false);
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();

    useWindowScrollPosition(({ currPos }) => {
        setHeaderStyle(currPos.y <= -1);
    });

    const getTitle = () => {
        if (!pathname) return "";
        if (pathname.includes("/about")) return "About";
        if (pathname.includes("/terms")) return "Terms of Service";
        if (pathname.includes("/privacy")) return "Privacy Policy";
        if (pathname.includes("/help")) return "Help Center";
        return "";
    };

    return (
        <header
            className={`top-0 left-0 right-0 z-20 border-b border-n-4 dark:border-n-6 transition-colors ${
                headerStyle ? "bg-white dark:bg-n-1" : "bg-n-2"
            }`}
        >
            <div className="flex justify-between items-center mx-auto w-full h-14 px-8 2xl:px-8 lg:px-6 mobile:px-6">
                {/* Left side: Page Title */}
                <div className="flex items-center">
                    <h4 className="mr-4 text-h4">
                        {getTitle()}
                    </h4>
                </div>

                {/* Right side: Login and Join buttons */}
                <div className="flex items-center space-x-4">
                    {isLoading ? (
                        <div className="flex space-x-4 items-center">
                            <div className="w-32 h-10 bg-n-3/20 dark:bg-n-6/50 rounded animate-pulse" />
                            <div className="w-20 h-10 bg-n-3/20 dark:bg-n-6/50 rounded animate-pulse" />
                        </div>
                    ) : !isAuthenticated ? (
                        <>
                            <Link
                                href="/register"
                                className="btn-purple btn-medium px-8"
                            >
                                Join
                            </Link>
                            <Link
                                href="/login"
                                className="btn btn-medium btn-stroke px-8 border-none"
                            >
                                Login
                            </Link>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default StaticHeader;
