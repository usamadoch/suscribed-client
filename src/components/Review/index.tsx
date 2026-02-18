import Link from "next/link";
import Image from "@/components/Image";
import Images from "./Images";
import Actions from "./Actions";
import ReadMore from "@/components/ReadMore";
import Icon from "../Icon";


type ReviewItem = {
    id: string;
    avatar: string;
    author: string;
    time: string;
    content: string;
    images: string[];
    likes: number;
    comments: number;
    isLiked: boolean;
    isLocked: boolean;
    shareUrl?: string;
    isOwner?: boolean;
}

type ReviewProps = {
    item: ReviewItem;
    imageBig?: boolean;
};

const Review = ({ item, imageBig }: ReviewProps) => {
    return (
        <div className="flex mb-4 p-5 pb-3 card last:mb-0">
            <div className="relative shrink-0 w-8.5 h-8.5">
                <Image
                    className="object-cover rounded-full"
                    family="avatar"
                    slot="comment"
                    src={item.avatar}
                    fill
                    alt="Avatar"
                />
            </div>
            <div className="w-[calc(100%-2.125rem)] pl-3.5">
                <div className="flex items-center">
                    <div className="whitespace-nowrap text-sm font-bold">
                        {item.author}
                    </div>
                    <div className="ml-2 pt-0.75 truncate text-xs font-medium text-n-3 dark:text-white/75">
                        {item.time}
                    </div>


                    {item.isOwner && (
                        <Link
                            href={`/posts/${item.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="btn-stroke btn-small  ml-auto"
                        >
                            <Icon name="edit" /> Edit
                        </Link>
                    )}

                </div>

                <div className={`text-sm ${item.isLocked ? "blur-[3px] select-none" : ""}`}>
                    <ReadMore>{item.content}</ReadMore>
                </div>

                {item.images && (
                    <Images items={item.images} imageBig={imageBig} />
                )}


                <Actions
                    postId={item.id}
                    comments={item.comments}
                    likes={item.likes}
                    isLiked={item.isLiked}
                    shareUrl={item.shareUrl}
                />

            </div>
        </div>
    );
};

export default Review;
