import { Post } from "@/types";
import Review from "@/components/Review";
import { mapPostToReviewItem } from "@/lib/post-mapper";

interface FeedItemProps {
    post: Post;
    onClick: (post: Post) => void;
}

const FeedItem = ({ post, onClick }: FeedItemProps) => {
    const postItem = mapPostToReviewItem(post);

    return (
        <div className="w-full">
            <div className="relative">
                <Review item={postItem} onCommentClick={() => onClick(post)} />
            </div>
        </div>
    );
};

export default FeedItem;
