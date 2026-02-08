import MediaItem from "./MediaItem";
import { MediaFile } from "../hooks/useMediaUpload";

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
                <MediaItem
                    key={file.id}
                    file={file}
                    index={index}
                    attachmentsLength={attachments.length}
                    removeAttachment={removeAttachment}
                    removeAllAttachments={removeAllAttachments}
                    retryUpload={retryUpload}
                />
            ))}
        </div>
    );
};

export default MediaPreview;
