import Icon from "@/components/Icon";
import Image from "@/components/Image";
import MuxVideoPlayer from "@/components/MuxVideoPlayer";
import { MediaFile } from "../hooks/useMediaUpload";
import ActionMenu from "@/components/ActionMenu";

type MediaItemProps = {
    file: MediaFile;
    index: number;
    attachmentsLength: number;
    removeAttachment: (id: string) => void;
    removeAllAttachments: () => void;
    retryUpload?: (id: string) => void;
};

const MediaItem = ({
    file,
    index,
    attachmentsLength,
    removeAttachment,
    removeAllAttachments,
    retryUpload
}: MediaItemProps) => {
    return (
        <div
            className={`relative w-full group ${index === 0 ? 'col-span-full' : ''}`}
        >
            {/* Media Preview */}
            <div className={`relative ${index === 0 ? 'h-96' : 'h-40'} rounded-lg border border-n-1 dark:border-n-6 overflow-hidden`}>
                {file.type === "image" ? (
                    <Image
                        family="post"
                        slot="feed"
                        src={file.url}
                        alt="Preview"
                        className="object-cover" // Image component handles classNames
                        fill
                    />
                ) : (
                    <MuxVideoPlayer
                        playbackId={file.uploadedData?.type === 'video' ? file.uploadedData.muxPlaybackId : undefined}
                        status={file.uploadedData?.type === 'video' ? file.uploadedData.status : undefined}
                        fallbackSrc={file.url}
                        className="w-full h-full"
                    />
                )}

                {/* Upload Progress Overlay - REMOVED */}

                {/* Error State Overlay */}
                {file.uploadStatus === 'error' && (
                    <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center">
                        <span className="text-white dark:text-n-9 text-2xl mb-2">⚠</span>
                        <span className="text-white dark:text-n-9 text-sm mb-2">Upload failed</span>
                        {retryUpload && (
                            <button
                                onClick={() => retryUpload(file.id)}
                                className="px-3 py-1 bg-white text-red-500 text-sm font-medium cursor-pointer"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                )}

                {/* Actions Menu - Moved inside media container for absolute positioning */}
                <div className="absolute top-2 right-2 z-10">
                    {index === 0 && attachmentsLength > 1 ? (
                        <ActionMenu
                            buttonClass="btn-square border border-black btn-small bg-purple-1 rounded-sm text-0 dark:text-n-1 cursor-pointer"
                            menuItemsClass="absolute right-0 top-8 mt-2 w-32 py-2 border border-n-1 rounded-sm bg-white dark:bg-n-1 dark:border-n-6 z-10 focus:outline-none"
                            items={[
                                {
                                    // icon: "trash",
                                    label: "Delete",
                                    className: "flex items-center w-full px-7 py-2 text-sm font-bold text-n-1 cursor-pointer dark:text-n-9",
                                    onClick: () => removeAttachment(file.id),
                                },
                                {
                                    // icon: "trash",
                                    label: "Delete All",
                                    className: "flex items-center w-full px-7 py-2 text-sm font-bold text-pink-1 cursor-pointer dark:text-n-9",
                                    onClick: removeAllAttachments,
                                }
                            ]}
                        />
                    ) : (
                        <button
                            className="w-8 h-8 bg-purple-1 border border-n-1 cursor-pointer rounded-sm text-0 flex items-center justify-center dark:text-n-1 "
                            onClick={() => removeAttachment(file.id)}
                            type="button"
                        >
                            <Icon name="close" />
                        </button>
                    )}
                </div>
            </div>

            {/* File Info & Actions */}
            <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex-1 min-w-0">
                    {file.isNew && (file.uploadStatus === 'uploading' || file.uploadStatus === 'completed') && (
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center text-xs text-n-3 dark:text-n-7">
                                <p className="text-xs text-n-3 dark:text-n-7 truncate">
                                    {file.file?.name || 'Existing file'}
                                </p>
                                <span>{file.uploadProgress}%</span>
                            </div>
                            <div className="h-1 w-full bg-n-3/20 rounded-full overflow-hidden dark:bg-n-7">
                                <div
                                    className="h-full bg-purple-1 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${file.uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaItem;
