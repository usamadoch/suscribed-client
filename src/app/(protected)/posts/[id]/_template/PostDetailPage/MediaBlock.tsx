import Image from '@/components/Image';
import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { constructSlotImageUrl } from '@/lib/image-slots';
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

    // Use slot logic for Cloudinary fallback
    const fallbackSrc = isVideo ? constructSlotImageUrl(media.url || thumbnailUrl, 'post', 'modal') : undefined;

    return (
        <div
            className={`w-full h-[512px] bg-gray-100 dark:bg-neutral-800 relative overflow-hidden ${className}`}
        >
            {isVideo ? (
                <MuxVideoPlayer
                    playbackId={muxPlaybackId}
                    status={muxStatus}
                    fallbackSrc={fallbackSrc}
                    className="w-full h-full"
                />
            ) : (
                <Image
                    family="post"
                    slot="modal"
                    src={media.url}
                    alt="Post media"
                    className="object-contain" // passed to Image which passes to NextImage
                    fill // We want it to fill the 512px container
                />
            )}
        </div>
    );
};

export default MediaBlock;
