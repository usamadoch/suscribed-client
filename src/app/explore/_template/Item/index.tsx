import Link from "next/link";
import Image from "@/components/Image";
import { ExploreCreator } from "@/types";

type ItemProps = {
    item: ExploreCreator;
};

const Item = ({ item }: ItemProps) => {
    return (
        <div
            className="flex "
        >
            <div className="flex items-center">
                <div className="relative w-20 h-20 mx-auto shrink-0">
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

                    <div className="text-base font-bold capitalize truncate">{item.displayName}</div>
                    <div className="text-xs font-medium text-n-3 dark:text-n-8 line-clamp-2">
                        {item.tagline}
                    </div>


                    <Link href={`/${item.pageSlug}`} className="btn-stroke btn-small h-6 mt-2">View</Link>
                </div>
            </div>

        </div>
    );
};

export default Item;
