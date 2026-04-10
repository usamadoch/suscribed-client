import CommentInput from "@/components/Comment";
import CommentItem from "@/components/CommentItem";
import { AuthUser, Comment } from "@/types";
import { useMyPage } from "@/hooks/queries";

interface CommentsSectionProps {
    user: AuthUser | null;
    value: string;
    setValue: (value: string) => void;
    handleCommentSubmit: () => void;
    isSubmittingComment: boolean;
    comments: Comment[];
    allowComments?: boolean;
}

const CommentsSection = ({
    user,
    value,
    setValue,
    handleCommentSubmit,
    isSubmittingComment,
    comments,
    allowComments = true
}: CommentsSectionProps) => {
    const { data: page } = useMyPage();

    const avatar = user?.role === 'creator' ? page?.avatarUrl : user?.avatarUrl;

    return (
        <>
            <div className="text-2xl font-bold mb-6 dark:text-n-9">Comments</div>
            <CommentInput
                className="mb-6 shadow-none"
                avatar={avatar}
                placeholder={allowComments ? "Type to add something" : "Comments are turned off for this post."}
                value={value}
                setValue={(e: any) => setValue(e.target.value)}
                onSend={handleCommentSubmit}
                disabled={!allowComments || !value.trim() || isSubmittingComment}
                inputDisabled={!allowComments}
            />

            <div className="flex flex-col gap-3">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))
                ) : (
                    <div className="text-n-3 text-sm dark:text-n-8">No comments yet.</div>
                )}
            </div>
        </>
    );
};

export default CommentsSection;