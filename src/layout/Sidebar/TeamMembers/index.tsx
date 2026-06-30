
import { useState } from "react";
import Link from "next/link";

import Image from "@/components/Image";
import Icon from "@/components/Icon";


import { usePermission } from "@/hooks/usePermission";
import { useMyMemberships } from "@/hooks/queries";
import { Member, CreatorPage } from "@/types";

type TeamMembersProps = {
    visible?: boolean;
    isMinimize?: boolean;
};

const TeamMembers = ({ visible, isMinimize }: TeamMembersProps) => {
    const canViewSubscriptions = usePermission('subscriptions:view');
    const { data: rawMemberships, isLoading } = useMyMemberships(canViewSubscriptions);

    // Filter active and ensure page data exists
    const members = (rawMemberships || []).filter((m: Member) =>
        m.status === 'active' && m.pageId && typeof m.pageId !== 'string'
    );

    const [isExpanded, setIsExpanded] = useState(false);

    if (!canViewSubscriptions) return null;

    if (isLoading) {
        return (

            <div className="-mx-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex items-center h-9.5 mb-1.5 px-4 ${visible ? "px-4" : isMinimize ? "px-0 justify-center" : "xl:px-0 xl:justify-center"}`}>
                        <div className={`shrink-0 w-5.5 h-5.5 rounded-full bg-n-3/20 dark:bg-n-6/50 animate-pulse ${visible ? "mr-2.5 ml-0" : isMinimize ? "mr-0" : "mr-2.5 xl:mr-0"}`} />
                        <div className={`h-3 w-24 rounded-sm bg-n-3/20 dark:bg-n-6/50 animate-pulse ${visible ? "block" : isMinimize ? "hidden" : "xl:hidden"}`} />
                    </div>
                ))}
            </div>
        );
    }

    const displayedMemberships = isExpanded ? members : members.slice(0, 4);

    return (
        <>

            <div className={visible ? "-mx-4" : isMinimize ? "mx-0" : "-mx-4 xl:mx-0"}>
                {displayedMemberships.map((item: Member) => {
                    const page = item.pageId as CreatorPage;
                    return (
                        <Link
                            className={`flex items-center h-9.5 mb-1.5 px-4 text-sm text-white font-bold last:mb-0 transition-colors ${visible ? "px-4 text-sm" : isMinimize ? "px-0 text-[0px] justify-center" : "xl:px-0 xl:text-0 xl:justify-center"
                                }`}
                            href={`/${page.pageSlug}`}
                            key={item._id}
                        >
                            <div
                                className={`relative shrink-0 w-5.5 h-5.5 rounded-full overflow-hidden ${visible ? "mr-2.5 ml-0" : isMinimize ? "mr-0" : "mr-2.5 xl:mr-0"
                                    }`}
                            >
                                <Image
                                    className="object-cover scale-105"
                                    family="avatar"
                                    slot="sidebar"
                                    src={page.avatarUrl}
                                    fill
                                    alt={page.displayName || "Page"}
                                />
                            </div>
                            {page.displayName}
                        </Link>
                    );
                })}
            </div>
            {members.length > 4 && (
                <button
                    className={`group flex items-center w-full mt-4 pl-0.5 text-xs font-medium text-white transition-colors hover:text-purple-1 ${visible ? "text-xs" : isMinimize ? "text-[0px] justify-center pl-0" : "xl:text-0 xl:justify-center xl:pl-0"
                        }`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Icon
                        className={`icon-18 fill-white transition-colors group-hover:fill-purple-1 ${visible ? "mr-3" : isMinimize ? "mr-0" : "mr-3 xl:mr-0"
                            } ${isExpanded ? "rotate-180" : ""}`}
                        name="arrow-bottom"
                    />
                    {isExpanded ? "See Less" : "See More"}
                </button>
            )}
        </>
    );
};

export default TeamMembers;
