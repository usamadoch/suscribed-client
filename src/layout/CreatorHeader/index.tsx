





"use client";
import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import Image from "@/components/Image";
import { useCreatorPage, usePost } from "@/hooks/queries";

import { useCreatorHeader } from "@/context/CreatorHeaderContext";
import { useAuth } from "@/store/auth";

type CreatorHeaderProps = {
    pageSlug?: string;
};

const navLinks = [
    {
        title: "Home",
        url: "",
    },
    {
        title: "Posts",
        url: "/posts",
    },
];

const CreatorHeader = ({ pageSlug }: CreatorHeaderProps) => {
    const [headerStyle, setHeaderStyle] = useState<boolean>(false);
    const { isHeaderHidden } = useCreatorHeader();
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const params = useParams();

    const paramSlug = params?.["page-slug"] as string | undefined;
    const postId = params?.id as string | undefined;

    let slug = (pageSlug || paramSlug) as string | undefined;

    const isValidPostId = !slug && postId && /^[a-f\d]{24}$/i.test(postId);
    const { data: postData, isLoading: isPostLoading } = usePost(isValidPostId ? postId! : "");

    if (!slug && postData?.pageId && typeof postData.pageId === 'object') {
        slug = (postData.pageId as any).pageSlug;
    }

    const { data, isLoading: isPageLoading } = useCreatorPage(slug);
    const isLoading = isPageLoading || (!!isValidPostId && isPostLoading);


    const { page } = data || {};
    const isOwner = data?.isOwner;
    const isMember = data?.isMember;

    useWindowScrollPosition(({ currPos }) => {
        setHeaderStyle(currPos.y <= -1);
    });

    const isLinkActive = (url: string) => {
        const fullUrl = `/${slug}${url}`;
        if (url === "") {
            return pathname === fullUrl;
        }
        return pathname.startsWith(fullUrl);
    };

    if (isHeaderHidden) {
        return null;
    }

    return (
        <header
            className={`top-0 left-0 right-0 z-20 border-b border-n-4 dark:border-n-6 transition-colors ${headerStyle ? "bg-white dark:bg-n-1" : "bg-n-2"
                }`}
        >
            <div className="flex justify-between items-center mx-auto w-full h-14 px-8 2xl:px-8 lg:px-6 mobile:px-6">
                <div className="flex items-center ">

                    {isLoading ? (
                        <div className="flex items-center gap-2 mr-24">
                            <div className="overflow-hidden rounded-full w-9 h-9 bg-n-3/20 dark:bg-n-6/50 animate-pulse" />
                            <div className="h-6 w-26 rounded bg-n-3/20 dark:bg-n-6/50 animate-pulse" />
                        </div>
                    ) : (
                        <Link href={`/${page?.pageSlug || slug || ''}`} className="flex items-center gap-2 mr-24 mobile:mr-4" >

                            <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden">
                                <Image
                                    className="object-cover mb-0"
                                    family="avatar"
                                    slot="profile"
                                    src={page?.avatarUrl}
                                    fill
                                    alt={page?.displayName || "Avatar"}
                                />
                            </div>
                            <div className="font-bold dark:text-n-9 truncate whitespace-nowrap">{page?.displayName || "Creator Page"}</div>

                        </Link>
                    )}

                    {isAuthenticated && (
                        <Link
                            href={user?.role === 'creator' ? "/dashboard" : "/"}
                            className="text-h6 dark:text-n-9 font-medium underline hover:no-underline transition-all duration-100 cursor-pointer flex items-center gap-2"
                        >
                            {user?.role === 'creator' ? "Dashboard" : "Home"}
                        </Link>
                    )}

                </div>

                <div className="flex items-center space-x-2 md:space-x-4 mobile:hidden">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={`/${slug}${link.url}`}
                            className={`btn btn-medium border-none ${isLinkActive(link.url)
                                ? "text-purple-1 fill-purple-1"
                                : "text-n-1 fill-n-1 dark:text-n-9 dark:fill-n-9 "
                                }`}
                        >
                            {link.title}
                        </Link>
                    ))}

                    {!isAuthenticated && !isOwner && !isMember && !isLoading && (
                        <Link
                            href="/login"
                            className="btn-purple btn-medium px-10 ml-2"
                        >
                            Login
                        </Link>
                    )}
                </div>

            </div>

            <div className="hidden mobile:flex items-center justify-between pl-3 pr-6 border-t border-n-4 dark:border-n-6 overflow-x-auto scrollbar-none">
                <div className="flex items-center">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={`/${slug}${link.url}`}
                            className={`btn btn-medium border-none px-3! font-bold ${isLinkActive(link.url)
                                ? "text-purple-1 fill-purple-1"
                                : "text-n-1 fill-n-1 dark:text-n-9 dark:fill-n-9 "
                                }`}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                {!isAuthenticated && !isOwner && !isMember && !isLoading && (
                    <Link
                        href="/login"
                        className="text-sm font-bold text-n-1 dark:text-n-9 underline"
                    >
                        Login
                    </Link>
                )}
            </div>

        </header >
    );
};

export default CreatorHeader;
