import { Post, CreatorPage } from "@/types";
import Review from "@/components/Review";
import { mapPostToReviewItem } from "@/lib/post-mapper";

type CreatorPostItemProps = {
    post: Post;
    page: CreatorPage | undefined;
    isOwner: boolean;
    onClick: (post: Post) => void;
};

const CreatorPostItem = ({ post, page, isOwner, onClick }: CreatorPostItemProps) => {
    const postItem = mapPostToReviewItem(post, page, isOwner);

    return <Review item={postItem} onCommentClick={() => onClick(post)} />;
};

export default CreatorPostItem;
