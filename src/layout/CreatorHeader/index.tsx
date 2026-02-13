





"use client";
import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import Image from "@/components/Image";
import { useCreatorPage } from "@/hooks/useQueries";
// import { usePageSlug } from "@/hooks/usePageSlug";
import { getFullImageUrl } from "@/lib/utils";
import Icon from "@/components/Icon";
import { useAuth } from "@/store/auth";

type CreatorHeaderProps = {
    pageName?: string;
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

const CreatorHeader = ({ pageName = "Creator Page", pageSlug }: CreatorHeaderProps) => {
    const [headerStyle, setHeaderStyle] = useState<boolean>(false);
    const pathname = usePathname();
    const params = useParams<{ "page-slug"?: string }>();
    // Use the prop if available, otherwise try to get it from the URL
    // If not in URL, this will be undefined, but won't crash with 404
    const slug = (pageSlug || params["page-slug"]) as string;

    const { data, isLoading } = useCreatorPage(slug);


    const { page } = data || {};
    const { user } = useAuth();


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

    return (
        <header
            className={`top-0 left-0 right-0 z-20 border-b border-n-1 dark:border-white transition-colors ${headerStyle ? "bg-white dark:bg-n-1" : "bg-transparent"
                }`}
        >
            <div className="flex justify-between items-center mx-auto w-full h-14 px-6 2xl:px-8 lg:px-6 md:px-5">
                <div className="flex items-center ">

                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="border border-n-1 dark:border-white rounded-full w-9 h-9 animate-skeleton bg-n-4/10"></div>
                            <div className="border border-n-1 dark:border-white h-6 w-26 animate-skeleton bg-n-4/10"></div>
                        </div>
                    ) : (
                        <Link href={`/${page?.pageSlug || slug}`} className="flex items-center gap-2 mr-24" >

                            <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden">
                                <Image
                                    className="object-cover mb-0"
                                    src={getFullImageUrl(page?.avatarUrl) || "/images/avatar-2.jpg"}
                                    fill
                                    alt={page?.displayName || "Avatar"}
                                    unoptimized
                                />
                            </div>
                            <div className="font-bold">{page?.displayName || pageName}</div>

                        </Link>
                    )}

                    {user?._id === (typeof page?.userId === 'string' ? page?.userId : page?.userId?._id) && (
                        <Link href="/dashboard" className="btn-stroke btn-medium gap-1">
                            <Icon name="burger" className="w-5 h-5 " />
                            Dashboard
                        </Link>
                    )}

                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={`/${slug}${link.url}`}
                            className={`btn-transparent-dark btn-medium ${isLinkActive(link.url)
                                ? "text-purple-1 fill-purple-1"
                                : "text-n-1 fill-n-1 dark:text-white dark:fill-white hover:text-purple-1 hover:fill-purple-1"
                                }`}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

            </div>
        </header >
    );
};

export default CreatorHeader;
