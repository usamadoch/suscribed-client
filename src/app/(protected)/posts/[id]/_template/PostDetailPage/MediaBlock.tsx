import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { getFullImageUrl } from '@/lib/utils';
import { MediaAttachment } from '@/lib/types';

// ─── Types ──────────────────────────────────────────────────

interface MediaBlockProps {
    /** A fully unlocked media attachment with a guaranteed `url`. */
    media: MediaAttachment;
    className?: string;
}

// ─── Component ──────────────────────────────────────────────

const MediaBlock = ({ media, className = '' }: MediaBlockProps) => {
    const isVideo =
        media.type === 'video' ||
        !!media.url.match(/\.(mp4|webm|ogg|mov)$/i);

    // Extract Mux-specific fields for video attachments
    const muxPlaybackId = media.type === 'video' ? media.muxPlaybackId : undefined;
    const muxStatus = media.type === 'video' ? media.status : undefined;
    const thumbnailUrl = media.type === 'video' ? media.thumbnailUrl : undefined;

    return (
        <div
            className={`w-full h-[512px] bg-gray-100 dark:bg-neutral-800 relative overflow-hidden ${className}`}
        >
            {isVideo ? (
                <MuxVideoPlayer
                    playbackId={muxPlaybackId}
                    status={muxStatus}
                    fallbackSrc={getFullImageUrl(media.url) || getFullImageUrl(thumbnailUrl)}
                    className="w-full h-full"
                />
            ) : (
                <img
                    src={getFullImageUrl(media.url)}
                    alt="Post media"
                    className="w-full h-full object-contain"
                />
            )}
        </div>
    );
};

export default MediaBlock;
