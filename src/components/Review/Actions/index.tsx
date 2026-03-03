import { useState } from "react";
import { MenuButton, Menu as MenuDropdown, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import Alert from "@/components/Alert";
import Comment from "@/components/Comment";
import LikeButton from "@/components/LikeButton";

type ActionsProps = {
    postId: string;
    comments: number;
    likes: number;
    isLiked: boolean;
    className?: string;
    showComment?: boolean;
    shareUrl?: string;
    type?: 'post' | 'comment';
};

const Actions = ({ postId, comments, likes: initialLikes, isLiked: initialIsLiked, className, showComment = true, shareUrl, type = 'post' }: ActionsProps) => {

    // Comment state
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    return (
        <>
            <div className={`flex items-center ${className}`}>

                <LikeButton postId={postId} initialLikes={initialLikes} initialIsLiked={initialIsLiked} />


                {showComment && (
                    <button className="flex items-center gap-1 ml-4 px-0">
                        <Icon name="comments" className="icon-22" viewBox="0 0 24 24" />
                        <span className="text-sm">{comments}</span>
                    </button>
                )}



                {type === 'post' ? (
                    <MenuDropdown as="div" className="ml-4 relative">
                        <MenuButton
                            className="px-0 cursor-pointer flex items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Icon name="reply" className="icon-18 dark:fill-white" viewBox="0 0 512 512" />
                        </MenuButton>
                        <MenuItems
                            transition
                            portal
                            anchor="bottom end"
                            className="z-100 w-[14.69rem] py-2 border border-n-1 bg-white shadow-primary-4 dark:bg-n-1 dark:border-white [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                        >
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    navigator.clipboard.writeText(fullUrl);
                                    toast.custom((t) => (
                                        <Alert
                                            className="mb-0 shadow-md"
                                            type="success"
                                            message="Link copied to clipboard"
                                            onClose={() => toast.dismiss(t.id)}
                                        />
                                    ), { position: "bottom-right" });
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="copy" viewBox="0 0 24 24" />
                                Copy link
                            </MenuItem>
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="facebook" />
                                Share on Facebook
                            </MenuItem>
                            <MenuItem
                                className="flex items-center cursor-pointer w-full h-10 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                as="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullUrl = shareUrl ? (shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`) : window.location.href;
                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`, '_blank');
                                }}
                            >
                                <Icon className="-mt-0.25 mr-3 fill-n-1 dark:fill-white" name="twitter" />
                                Share on Twitter
                            </MenuItem>
                        </MenuItems>
                    </MenuDropdown>
                ) : (
                    showComment && (
                        <button
                            className={` ml-4 cursor-pointer`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCommentOpen(!isCommentOpen);
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
