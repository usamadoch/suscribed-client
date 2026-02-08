import Icon from "@/components/Icon";
import { MediaFile } from "../hooks/useMediaUpload";

type ToolbarProps = {
    openFileSelector: () => void;
    onFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    attachments?: MediaFile[];
};

const PostToolbar = ({ openFileSelector, onFileSelection, fileInputRef, attachments = [] }: ToolbarProps) => {
    const hasVideo = attachments.some(a => a.type === 'video');
    const hasImages = attachments.some(a => a.type === 'image');

    const triggerUpload = (acceptType: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = acceptType;
            openFileSelector();
        }
    };

    return (
        <div className="flex items-center  justify-between w-full h-13.5 md:px-3">
            <div className="flex items-center ml-2 gap-2">
                <button
                    className={`btn-stroke btn-small md:grow ${hasImages || hasVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="button"
                    onClick={() => triggerUpload("video/*")}
                    disabled={hasImages || hasVideo}
                >
                    <Icon name="forward" />
                    <span>Video</span>
                </button>
                <button
                    className={`btn-stroke btn-small md:grow ${hasVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="button"
                    onClick={() => triggerUpload("image/*")}
                    disabled={hasVideo}
                >
                    <Icon name="forward" />
                    <span>Image</span>
                </button>


                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileSelection}
                    accept="image/*,video/*"
                    multiple
                />
            </div>
        </div>
    );
};

export default PostToolbar;
