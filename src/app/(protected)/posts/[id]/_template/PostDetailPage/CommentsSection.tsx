import CommentInput from "@/components/Comment";
import CommentItem from "@/components/CommentItem";
import { User, Comment } from "@/lib/types";

interface CommentsSectionProps {
    user: User | null;
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
    return (
        <>
            <div className="text-2xl font-bold mb-6">Comments</div>
            <CommentInput
                className="mb-6 shadow-none"
                avatar={user?.avatarUrl || "/images/avatars/avatar.jpg"}
                placeholder={allowComments ? "Type to add something" : "Comments are turned off for this post."}
                value={value}
                setValue={(e: any) => setValue(e.target.value)}
                onSend={handleCommentSubmit}
                disabled={!allowComments || !value.trim() || isSubmittingComment}
                inputDisabled={!allowComments}
            />

            <div>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))
                ) : (
                    <div className="text-n-3 text-sm">No comments yet.</div>
                )}
            </div>
        </>
    );
};

export default CommentsSection;