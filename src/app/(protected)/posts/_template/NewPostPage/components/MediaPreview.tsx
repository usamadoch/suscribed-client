import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import Icon from "@/components/Icon";
import MuxVideoPlayer from "@/components/MuxVideoPlayer";
import { MediaFile } from "../usePostForm";

type MediaPreviewProps = {
    attachments: MediaFile[];
    removeAttachment: (id: string) => void;
    removeAllAttachments: () => void;
    retryUpload?: (id: string) => void;
};

const MediaPreview = ({
    attachments,
    removeAttachment,
    removeAllAttachments,
    retryUpload
}: MediaPreviewProps) => {
    if (attachments.length === 0) return null;

    return (
        <div className={`grid mt-4 gap-4 pl-4 pb-4 ${attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {attachments.map((file, index) => (
                <div
                    key={file.id}
                    className={`relative w-full group ${index === 0 ? 'col-span-full' : ''}`}
                >
                    {/* Media Preview */}
                    <div className={`relative ${index === 0 ? 'h-96' : 'h-40'} rounded-lg border border-n-1 overflow-hidden`}>
                        {file.type === "image" ? (
                            <img
                                src={file.url}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <MuxVideoPlayer
                                playbackId={file.uploadedData?.type === 'video' ? file.uploadedData.muxPlaybackId : undefined}
                                status={file.uploadedData?.type === 'video' ? file.uploadedData.status : undefined}
                                fallbackSrc={file.url}
                                className="w-full h-full"
                            />
                        )}

                        {/* Upload Progress Overlay */}
                        {file.uploadStatus === 'uploading' && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 relative">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="4"
                                            strokeDasharray={`${2 * Math.PI * 28}`}
                                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - file.uploadProgress / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                        {file.uploadProgress}%
                                    </span>
                                </div>
                                <span className="text-white text-xs mt-2">Uploading...</span>
                            </div>
                        )}

                        {/* Error State Overlay */}
                        {file.uploadStatus === 'error' && (
                            <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center">
                                <span className="text-white text-2xl mb-2">⚠</span>
                                <span className="text-white text-sm mb-2">Upload failed</span>
                                {retryUpload && (
                                    <button
                                        onClick={() => retryUpload(file.id)}
                                        className="px-3 py-1 bg-white text-red-500 rounded text-sm font-medium hover:bg-gray-100"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* File Info & Actions */}
                    <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-n-3 dark:text-white/60 truncate">
                                {file.file?.name || 'Existing file'}
                            </p>
                            {file.uploadStatus === 'completed' && (
                                <p className="text-xs text-green-500">✓ Ready</p>
                            )}
                        </div>

                        {/* Actions Menu */}
                        <div className="shrink-0 ml-2">
                            {index === 0 ? (
                                <Menu className="relative" as="div">
                                    <MenuButton className="btn-square border border-black btn-small cursor-pointer bg-purple-1 rounded-sm text-0 transition-colors hover:bg-purple-2">
                                        <Icon name="dots" />
                                    </MenuButton>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <MenuItems className="absolute right-0 mt-2 w-32 py-2 border border-n-1 rounded-sm bg-white shadow-primary-4 dark:bg-n-1 dark:border-white z-10">
                                            <MenuItem>
                                                <button
                                                    className="flex items-center w-full px-4 py-2 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                                                    onClick={() => removeAttachment(file.id)}
                                                >
                                                    <Icon className="w-4 h-4 mr-2 fill-n-1 dark:fill-white" name="trash" />
                                                    Delete
                                                </button>
                                            </MenuItem>
                                            {attachments.length > 1 && (
                                                <MenuItem>
                                                    <button
                                                        className="flex items-center w-full px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-n-3/10 dark:text-red-500 dark:hover:bg-white/20"
                                                        onClick={removeAllAttachments}
                                                    >
                                                        <Icon className="w-4 h-4 mr-2 fill-red-500" name="trash" />
                                                        Delete All
                                                    </button>
                                                </MenuItem>
                                            )}
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            ) : (
                                <button
                                    className="w-8 h-8 bg-purple-1 border border-n-1 rounded-sm text-0 transition-colors hover:bg-purple-2 flex items-center justify-center"
                                    onClick={() => removeAttachment(file.id)}
                                    type="button"
                                >
                                    <Icon name="close" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaPreview;
