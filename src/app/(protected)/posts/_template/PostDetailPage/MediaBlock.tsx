import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { MediaAttachment } from '@/lib/types';
import Image from '@/components/Image';
import { constructSlotImageUrl } from '@/lib/image-slots';

type MediaBlockProps = {
    className?: string;
} & (
        | { media: MediaAttachment; url?: never; type?: never }
        | { media?: never; url: string; type?: 'image' | 'video' }
    );

const MediaBlock = (props: MediaBlockProps) => {
    const { className = '' } = props;

    // Support both new media object and legacy url/type props
    const mediaUrl = props.media?.url || props.url;
    const mediaType = props.media?.type || props.type;

    // For videos, check if we have Mux playback info
    const isVideo = mediaType === 'video' || (!mediaType && !!mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i));
    const muxPlaybackId = props.media?.type === 'video' ? props.media.muxPlaybackId : undefined;
    const muxStatus = props.media?.type === 'video' ? props.media.status : undefined;
    const thumbnailUrl = props.media?.type === 'video' ? props.media.thumbnailUrl : undefined;

    // If no media at all, don't render
    if (!mediaUrl && !props.media && !isVideo) return null;

    // Construct valid fallback URL for video player
    const fallbackSrc = isVideo ? constructSlotImageUrl(mediaUrl || thumbnailUrl, 'post', 'modal') : undefined;

    return (
        <div className={`w-full h-[512px] bg-gray-100 dark:bg-neutral-800 relative overflow-hidden ${className}`}>
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
                    src={mediaUrl}
                    alt="Post media"
                    className="object-contain" // passed to Image which passes to NextImage (along with fill generally or intrinsic)
                    fill // We want it to fill the 512px container
                />
            )}
        </div>
    );
};

export default MediaBlock;
