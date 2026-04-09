"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";
import { usePathname } from "next/navigation";
import SuggestedCreators from "./SuggestedCreators";

const RightAuthSidebar = () => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    if (isAuthenticated) return null;

    return (
        <div className="flex xl:hidden sticky shrink-0 top-6 mt-6 flex-col w-96 h-fit overflow-auto z-30">

            {/* Persuasive Text */}
            <div className=" bg-white dark:bg-n-4 border border-n-6 p-6">
                <h6 className="text-h6 font-bold mb-3 dark:text-n-9">Ready to join?</h6>
                <p className=" dark:text-n-8 text-sm mb-8">
                    Connect with your favorite creators, discover exclusive content, and become part of a community today.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <Link
                        href="/login"
                        className="btn-primary btn-shadow btn-purple w-full"
                    >
                        Log In or Sign Up
                    </Link>
                </div>
            </div>

            {/* Suggested Creators */}
            {pathname === "/" && <SuggestedCreators />}
        </div>
    );
};

export default RightAuthSidebar;
