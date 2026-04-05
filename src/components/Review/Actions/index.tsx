import { useState } from "react";
import ActionMenu from "@/components/ActionMenu";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import Alert from "@/components/Alert";
import Comment from "@/components/Comment";
import LikeButton from "@/components/LikeButton";
import { getSocialShareItems } from "@/utils/share";

type ActionsProps = {
    postId: string;
    comments: number;
    likes: number;
    isLiked: boolean;
    className?: string;
    showComment?: boolean;
    shareUrl?: string;
    type?: 'post' | 'comment';
    onCommentClick?: () => void;
};

const Actions = ({ postId, comments, likes: initialLikes, isLiked: initialIsLiked, className, showComment = true, shareUrl, type = 'post', onCommentClick }: ActionsProps) => {

    // Comment state
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    const shareItems = getSocialShareItems({
        url: shareUrl || `/post/${postId}`,
        onCopySuccess: () => {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="success"
                    message="Link copied to clipboard"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        }
    });

    return (
        <>
            <div className={`flex items-center ${className}`}>

                <LikeButton postId={postId} initialLikes={initialLikes} initialIsLiked={initialIsLiked} />


                {showComment && (
                    <button
                        className="flex items-center gap-1 ml-4 px-0 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onCommentClick) {
                                onCommentClick();
                            }
                        }}
                    >
                        <Icon name="comments" className="icon-22" viewBox="0 0 24 24" />
                        <span className="text-sm">{comments}</span>
                    </button>
                )}



                {type === 'post' ? (
                    <ActionMenu
                        className="ml-4"
                        buttonClass="px-0 cursor-pointer flex items-center focus:outline-none"
                        iconName="reply"
                        iconClass="icon-18 dark:fill-white"
                        iconViewBox="0 0 512 512"
                        anchor="bottom end"
                        portal
                        menuItemsClass="z-[9999] border border-n-4 rounded-sm w-[14.69rem] py-2 bg-white dark:bg-n-1 focus:outline-none [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                        items={shareItems}
                    />
                ) : (
                    showComment && (
                        <button
                            className={` ml-4 cursor-pointer`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCommentOpen(!isCommentOpen);
                                if (onCommentClick) {
                                    onCommentClick();
                                }
                            }}
                        >
                            <Icon name="reply" className="icon-18 dark:fill-white" viewBox="0 0 512 512" />
                        </button>
                    )
                )}

            </div>
            {isCommentOpen && type === 'comment' && (
                <Comment
                    className="mt-4 mb-2 pr-4! py-0! pl-0! border-dashed shadow-none md:-ml-12 md:pr-3!"
                    placeholder="Type to add your comment"
                    value={commentValue}
                    setValue={(e) => setCommentValue(e.target.value)}
                />
            )}
        </>
    );
};

export default Actions;
