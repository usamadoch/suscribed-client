import { Post, isLockedMedia, CreatorPage } from "@/lib/types";
import { formatAppDate } from "@/lib/date";
import Review from "@/components/Review";

type CreatorPostItemProps = {
    post: Post;
    page: CreatorPage | undefined;
    isOwner: boolean;
    onClick: (post: Post) => void;
};

const CreatorPostItem = ({ post, page, isOwner, onClick }: CreatorPostItemProps) => {
    let content: string;
    let images: string[] = [];
    let isLocked = post.isLocked;

    if (post.isLocked) {
        content = post.teaser || 'Exclusive content for members';

        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => m.thumbnailUrl)
                .map(m => m.thumbnailUrl!)
                .filter((url): url is string => !!url);
        }
    } else {
        content = post.caption || '';
        if (post.postType === 'image') {
            const attachments = post.mediaAttachments || [];
            images = attachments
                .filter(m => !isLockedMedia(m) && m.url)
                .map(m => m.url)
                .filter((url): url is string => !!url);
        }
    }

    const postItem = {
        id: post._id,
        author: page?.displayName || "",
        avatar: page?.avatarUrl || "/images/content/avatar-1.jpg",
        time: formatAppDate(post.createdAt, { suffix: true }),
        content: content,
        images: images,
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        isLiked: !!post.isLiked,
        isLocked: isLocked,
        shareUrl: `/posts/${post._id}`,
        isOwner: !!isOwner,
    };

    return (
        <div className="w-full">
            <div className="relative">
                <div
                    className="cursor-pointer"
                    onClick={() => onClick(post)}
                >
                    <Review item={postItem} />
                </div>
            </div>
        </div>
    );
};

export default CreatorPostItem;
