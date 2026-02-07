import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { getFullImageUrl } from '@/lib/utils';
import { MediaAttachment } from '@/lib/types';

interface MediaBlockProps {
    media?: MediaAttachment;
    // Legacy props for backward compatibility
    url?: string;
    type?: 'image' | 'video';
    className?: string;
}

const MediaBlock = ({ media, url, type, className = '' }: MediaBlockProps) => {
    // Support both new media object and legacy url/type props
    const mediaUrl = media?.url || url;
    const mediaType = media?.type || type;

    console.log(media


    );

    // For videos, check if we have Mux playback info
    const isVideo = mediaType === 'video' || (!mediaType && !!mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i));
    const muxPlaybackId = media?.type === 'video' ? media.muxPlaybackId : undefined;
    const muxStatus = media?.type === 'video' ? media.status : undefined;
    const thumbnailUrl = media?.type === 'video' ? media.thumbnailUrl : undefined;

    // If no media at all, don't render

    if (!mediaUrl && !media && !isVideo) return null;


    console.log(mediaUrl);

    return (
        <div className={`w-full h-[512px] bg-gray-100 dark:bg-neutral-800 relative overflow-hidden ${className}`}>
            {isVideo ? (
                <MuxVideoPlayer
                    playbackId={muxPlaybackId}
                    status={muxStatus}
                    fallbackSrc={getFullImageUrl(mediaUrl) || getFullImageUrl(thumbnailUrl)}
                    className="w-full h-full"
                />
            ) : (
                <img
                    src={getFullImageUrl(mediaUrl)}
                    alt="Post media"
                    className="w-full h-full object-contain"
                />
            )}
        </div>
    );
};

export default MediaBlock;
