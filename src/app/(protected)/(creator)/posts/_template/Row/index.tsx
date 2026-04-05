import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ActionMenu from "@/components/ActionMenu";
import { format } from "date-fns";

import { useDeletePost } from "@/hooks/useQueries";

import DeletePostModal from "@/components/modals/DeletePostModal";
import Image from "@/components/Image";
import Icon from "@/components/Icon";




interface RowItem {
    _id: string;
    caption?: string | null;
    mediaAttachments?: { type: string; url?: string | null }[];
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    visibility?: string;
    publishedAt?: string | null;
    createdAt?: string;
    postType?: string;
}

type RowProps = {
    item: RowItem;
    showActions?: boolean;
};

const Row = ({ item, showActions = true }: RowProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: deletePost, isPending } = useDeletePost();

    // Caption preview
    const captionPreview = item.caption || "No caption";
    const truncatedPreview = captionPreview.length > 50 ? captionPreview.substring(0, 80) + "..." : captionPreview;

    // Thumbnail
    const mediaItem = item.mediaAttachments?.find(m => m.type === 'image' || m.type === 'video');
    const isVideo = mediaItem?.type === 'video' || item.postType === 'video';
    const isImage = mediaItem?.type === 'image' || item.postType === 'image';
    const mediaUrl = mediaItem?.url;

    const postTypeIcon = isVideo ? 'video' : isImage ? 'camera' : 'document';

    const handleDelete = () => {
        deletePost(item._id, {
            onSuccess: () => {
                toast.success("Post deleted successfully");
                setIsOpen(false);
            },
            onError: () => {
                toast.error("Failed to delete post");
            }
        });
    };

    return (
        <>
            <tr className="">
                <td className="td-custom py-3.5">
                    <Link
                        className="inline-flex items-center text-sm  transition-colors hover:text-purple-1"
                        href={`/posts/${item._id}`}
                    >
                        <div className={`shrink-0 w-32 mr-5 border border-n-1 overflow-hidden aspect-video relative flex justify-center items-center ${isVideo ? 'bg-n-2 dark:bg-n-7' : 'bg-n-2 dark:bg-n-7'}`}>
                            {isVideo ? (
                                <Icon name="video" className="w-8 h-8 fill-n-4 dark:fill-n-4" />
                            ) : (
                                <Image
                                    className="object-cover"
                                    family="thumb"
                                    slot="notification"
                                    src={mediaUrl}
                                    fill
                                    alt={item.caption || "Post thumbnail"}
                                />
                            )}
                            <div className="absolute top-1 right-1 bg-black/50 p-1 rounded-lg flex items-center justify-center">
                                <Icon name={postTypeIcon} className="w-3 h-3 fill-white" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <div className="text-n-2 4xl:max-w-70 dark:text-white/75">
                                {truncatedPreview}
                            </div>

                            <div className="text-xs text-n-3 flex items-center gap-3">
                                <span>{item.viewCount || 0} views</span>
                                <span>{item.likeCount || 0} likes</span>
                                <span>{item.commentCount || 0} comments</span>
                            </div>
                        </div>
                    </Link>

                </td>

                <td className="td-custom py-3.5 text-n-3">
                    {item.publishedAt ? format(new Date(item.publishedAt), 'MMM d, yyyy') : 'Draft'}
                </td>
                <td className="td-custom py-3.5 text-n-3 capitalize">
                    {item.visibility || 'private'}
                </td>

                {showActions && (
                    <td className="td-custom py-3.5 text-right">
                        <ActionMenu
                            buttonClass="btn-stroke btn-small btn-square"
                            items={[
                                {
                                    icon: "edit",
                                    label: "Edit",
                                    onClick: () => window.location.href = `/posts/${item._id}/edit`
                                },
                                {
                                    icon: "remove",
                                    label: "Delete",
                                    className: "flex items-center cursor-pointer w-full px-4 py-2 text-sm font-bold text-pink-1 hover:bg-n-3/10 dark:hover:bg-white/20 transition-colors",
                                    onClick: () => setIsOpen(true)
                                }
                            ]}
                        />

                        <DeletePostModal
                            visible={isOpen}
                            onClose={() => setIsOpen(false)}
                            onDelete={handleDelete}
                            isPending={isPending}
                        />
                    </td>
                )}
            </tr >
        </>
    );
};

export default Row;
