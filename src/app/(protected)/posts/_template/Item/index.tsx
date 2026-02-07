import Link from "next/link";
import Image from "@/components/Image";

import { Post } from "@/lib/types";
import { getFullImageUrl } from "@/lib/utils";

type ItemProps = {
    item: Post;
};

const Item = ({ item }: ItemProps) => {
    const imageUrl = (item.mediaAttachments?.[0]?.url
        ? getFullImageUrl(item.mediaAttachments[0].url)
        : "/images/content/product-1.jpg") || "/images/content/product-1.jpg"; // Fallback image

    return (
        <Link
            className="flex items-center p-4 border-b border-n-1 text-sm last:border-none dark:border-white"
            href={`/posts/${item._id}`}
        >
            <div className="shrink-0 w-[4.25rem] border border-n-1">
                <Image
                    className="w-full object-cover aspect-square"
                    src={imageUrl}
                    width={74}
                    height={74}
                    alt={item.caption || "Post thumbnail"}
                    unoptimized
                />
            </div>
            <div className="w-[calc(100%-4.25rem)] pl-5">
                <div className="truncate font-bold mb-1">{item.caption || "Untitled Post"}</div>
                <div className="mb-2 truncate text-xs text-n-3 dark:text-white/75">
                    {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center text-xs font-medium">
                    <div className="inline-flex items-center shrink-0 gap-3">
                        <span>{item.viewCount} views</span>
                        <span>{item.likeCount} likes</span>
                    </div>
                    <div className="font-bold">{item.commentCount} comments</div>
                </div>
            </div>
        </Link>
    );
};

export default Item;
