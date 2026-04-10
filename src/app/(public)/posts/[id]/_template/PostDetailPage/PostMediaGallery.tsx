import Image from "@/components/Image";
import LockedContent from "./LockedContent";
import MediaCarousel from "./MediaCarousel";
import MediaBlock from "./MediaBlock";
import { AnyMediaAttachment, MediaAttachment } from "@/types";

interface PostMediaGalleryProps {
    locked: boolean;
    mediaItems: AnyMediaAttachment[];
    unlockedMediaItems: MediaAttachment[];
}

const PostMediaGallery = ({
    locked,
    mediaItems,
    unlockedMediaItems,
}: PostMediaGalleryProps) => {
    if (mediaItems.length === 0) return null;

    if (locked) {
        return (
            <div className="relative w-full h-[512px] bg-n-2 mb-6 overflow-hidden">
                <LockedContent
                    type="overlay"
                    text="Join to unlock this content"
                />
                <Image
                    className="object-contain"
                    src={mediaItems[0].thumbnailUrl || "/images/img-1.jpg"}
                    fill
                    alt="Locked content preview"
                    unoptimized
                />
            </div>
        );
    }

    if (unlockedMediaItems.length > 1) {
        return <MediaCarousel items={unlockedMediaItems} />;
    }

    return (
        <>
            {unlockedMediaItems.map((media: MediaAttachment, index: number) => (
                <MediaBlock key={index} media={media} className="mb-4" />
            ))}
        </>
    );
};

export default PostMediaGallery;
