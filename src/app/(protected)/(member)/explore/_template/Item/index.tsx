import Link from "next/link";
import Image from "@/components/Image";
import { ExploreCreator } from "@/lib/types";

type ItemProps = {
    item: ExploreCreator;
};

const Item = ({ item }: ItemProps) => {
    return (
        <Link
            className="flex flex-col w-[calc(25%-1.25rem)] mt-5 mx-2.5 card text-center lg:w-[calc(50%-1.25rem)] md:w-[calc(100%-1.25rem)] md:mt-3"
            href={`/${item.pageSlug}`}
        >
            <div className="relative grow pt-12 pb-7 md:pt-4 md:pb-4">
                <div className="relative w-24 h-24 mx-auto mb-3.5">
                    <Image
                        className="object-cover rounded-full"
                        family="avatar"
                        slot="profile"
                        src={item.avatarUrl}
                        fill
                        alt={item.displayName}
                    />
                </div>
                <div className="text-sm font-bold truncate">{item.displayName}</div>
                <div className="mb-4 text-xs font-medium text-n-3 truncate">
                    {item.tagline}
                </div>
            </div>

            <div className="flex">
                <div className="p-3 flex items-center gap-1 text-xs font-medium text-n-3 dark:text-white/75">
                    <span className="text-sm font-bold">{item.postCount}</span>
                    Posts
                </div>
                <div className="p-3 flex items-center gap-1 text-xs font-medium text-n-3 dark:text-white/75">
                    <span className="text-sm font-bold">{item.memberCount}</span>
                    Members
                </div>
            </div>
        </Link>
    );
};

export default Item;
