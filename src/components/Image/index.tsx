import { useState } from "react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import {
    SlotFamily,
    SlotName,
    constructSlotImageUrl,
    getSlotDimensions
} from "@/lib/image-slots";

// Discriminated Union: 
// Either strict Slot usage OR legacy usage (to be refactored)
type SlotImageProps<F extends SlotFamily> = Omit<NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    src: string | null | undefined;
    alt: string;
    family: F;
    slot: SlotName<F>;
    className?: string; // Only for positioning/margins, NOT sizing
};

type LegacyImageProps = NextImageProps & {
    family?: never;
    slot?: never;
};

type ImageProps = SlotImageProps<any> | LegacyImageProps;

const Image = (props: ImageProps) => {
    const [loaded, setLoaded] = useState(false);
    const { className, ...rest } = props;

    // Slot Mode
    if (props.family && props.slot) {
        const { src, family, slot, alt, fill, ...restProps } = props as SlotImageProps<any>;

        // 1. Get Config
        const { width, height, label } = getSlotDimensions(family, slot);

        // 2. Generate Optimized URL
        const optimizedSrc = constructSlotImageUrl(src, family, slot);

        // 3. Fallback for empty src
        const finalSrc = optimizedSrc || '/images/placeholder-empty.png'; // Todo: Add better placeholder strategy

        const imageProps: NextImageProps = {
            className: `inline-block align-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className || ''}`,
            src: finalSrc,
            alt: alt || label,
            onLoadingComplete: () => setLoaded(true),
            unoptimized: !src?.includes('cloudinary'), // Let Next.js optimize if not cloudinary, or false if cloudinary handles it
            fill,
            ...restProps
        };

        if (!fill) {
            imageProps.width = width;
            imageProps.height = height;
        }

        return (
            <NextImage {...imageProps} /> // Spreading props carefully
        );
    }

    // Legacy Mode (Passthrough)
    const { src, alt, ...legacyProps } = props as LegacyImageProps;
    return (
        <NextImage
            className={`inline-block align-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                } ${className || ''}`}
            src={src || ''}
            alt={alt || ''}
            onLoadingComplete={() => setLoaded(true)}
            {...legacyProps}
        />
    );
};

export default Image;
