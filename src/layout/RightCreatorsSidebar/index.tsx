"use client";

import Link from "next/link";
import Image from "@/components/Image";
import Loader from "@/components/Loader";
import { useExploreCreators } from "@/app/explore/_template/useExploreCreators";

const RightCreatorsSidebar = () => {
    const { creators, isLoading } = useExploreCreators();
    
    // get top 4 creators to display
    const suggestedCreators = creators.slice(0, 4);

    if (isLoading) {
        return (
            <div className="flex xl:hidden sticky shrink-0 top-6 mt-6 flex-col w-96 h-fit bg-white dark:bg-n-4 border border-n-6 p-6 z-30 justify-center items-center rounded-2xl shadow-sm">
                <Loader />
            </div>
        );
    }

    if (suggestedCreators.length === 0) return null;

    return (
        <div className="flex xl:hidden sticky shrink-0 top-6 mt-6 flex-col w-96 h-fit bg-white dark:bg-n-4 border border-n-6 p-6 overflow-auto z-30 shadow-sm rounded-2xl">
            <h6 className="text-h6 font-bold mb-5 dark:text-n-9">Suggested Creators</h6>

            <div className="flex flex-col gap-6">
                {suggestedCreators.map(item => (
                    <div key={item._id} className="flex">
                        <div className="flex items-center w-full">
                            <div className="relative w-20 h-20 shrink-0">
                                <Image
                                    className="object-cover rounded-3xl"
                                    family="avatar"
                                    slot="profile"
                                    src={item.avatarUrl}
                                    fill
                                    alt={item.displayName}
                                />
                            </div>

                            <div className="ml-6 min-w-0 flex-1">
                                <div className="text-base font-bold truncate">{item.displayName}</div>
                                <div className="text-xs font-medium text-n-3 dark:text-n-8 line-clamp-2">
                                    {item.tagline}
                                </div>
                                <Link href={`/${item.pageSlug}`} className="btn-stroke btn-small h-6 mt-2">View</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <Link href="/explore" className="btn-stroke w-full mt-8">
                Discover More
            </Link>
        </div>
    );
};

export default RightCreatorsSidebar;
