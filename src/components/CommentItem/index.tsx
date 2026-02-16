
import { formatAppDate } from "@/lib/date";
import Image from "@/components/Image";
import Actions from "@/components/Review/Actions";
import { Comment as PostComment } from "@/lib/types";

interface CommentItemProps {
    comment: PostComment;
    variant?: 'default' | 'modal';
}

const CommentItem = ({ comment, variant = 'default' }: CommentItemProps) => {
    const author = typeof comment.authorId === 'object' ? comment.authorId : null;
    const authorName = author?.displayName || author?.username || 'User';
    const timeAgo = comment.createdAt ? formatAppDate(comment.createdAt) : "";

    // "default" applies the card style (border, shadow, padding)
    // "modal" applies a cleaner style (no border, minimal padding/margin)
    const containerClasses = variant === 'default'
        ? "flex p-5 pb-3 card last:mb-0"
        : "flex last:mb-0";

    return (
        <div className={containerClasses}>
            <div className="relative shrink-0 w-8.5 h-8.5">
                <Image
                    className="object-cover rounded-full"
                    family="avatar"
                    slot="comment"
                    src={author?.avatarUrl}
                    fill
                    alt={authorName}
                />
            </div>
            <div className="w-[calc(100%-2.125rem)] pl-3.5">
                <div className="flex items-baseline">
                    <div className="whitespace-nowrap text-sm font-bold text-n-1 dark:text-white">
                        {authorName}
                    </div>
                    <div className="ml-2 pt-0.75 truncate text-xs font-medium text-n-3 dark:text-white/75">
                        {timeAgo}
                    </div>
                </div>
                <div className="text-sm text-n-1 dark:text-white/80">{comment.content}</div>

                <Actions
                    postId={comment._id}
                    comments={0}
                    likes={0}
                    isLiked={false}
                    showComment={false}
                    className="mt-2"
                />
            </div>
        </div>
    );
};

export default CommentItem;
