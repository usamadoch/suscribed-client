import { useState } from "react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import Icon from "@/components/Icon";
import {
    SlotFamily,
    SlotName,
    constructSlotImageUrl,
    getSlotDimensions
} from "@/lib/image-slots";

// --- Fallback config per family ---
const FAMILY_FALLBACKS: Record<string, { icon: string; viewBox: string; bg: string; iconClass: string }> = {
    avatar: { icon: "profile", viewBox: "0 0 16 16", bg: "bg-n-3/80 dark:bg-white/20", iconClass: "w-1/2 h-1/2 fill-white dark:fill-white/70" },
    banner: { icon: "camera", viewBox: "0 0 16 16", bg: "bg-n-3/10 dark:bg-white/5", iconClass: "w-6 h-6 fill-n-3 dark:fill-white/30" },
    post: { icon: "camera", viewBox: "0 0 16 16", bg: "bg-n-3/10 dark:bg-white/5", iconClass: "w-8 h-8 fill-n-3 dark:fill-white/30" },
    thumb: { icon: "camera", viewBox: "0 0 16 16", bg: "bg-n-3/10 dark:bg-white/5", iconClass: "w-4 h-4 fill-n-3 dark:fill-white/30" },
};

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
    const [errored, setErrored] = useState(false);
    const { className, ...rest } = props;

    // Slot Mode
    if (props.family && props.slot) {
        const { src, family, slot, alt, fill, ...restProps } = props as SlotImageProps<any>;

        // 1. Get Config
        const { width, height, label } = getSlotDimensions(family, slot);

        // 2. Generate Optimized URL (returns '' if src is empty)
        const optimizedSrc = src ? constructSlotImageUrl(src, family, slot) : '';

        // 3. If no valid src, render a fallback div with icon
        if (!optimizedSrc || errored) {
            const fallback = FAMILY_FALLBACKS[family] || FAMILY_FALLBACKS.post;
            return (
                <div
                    className={`flex items-center justify-center ${fallback.bg} ${fill ? 'absolute inset-0' : ''} ${className || ''}`}
                    style={!fill ? { width, height } : undefined}
                    role="img"
                    aria-label={alt || label}
                >
                    <Icon name={fallback.icon} viewBox={fallback.viewBox} className={fallback.iconClass} />
                </div>
            );
        }

        const imageProps: NextImageProps = {
            className: `inline-block align-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className || ''}`,
            src: optimizedSrc,
            alt: alt || label,
            onLoad: () => setLoaded(true),
            onError: () => setErrored(true),
            unoptimized: !src?.includes('cloudinary'),
            fill,
            ...restProps
        };

        if (!fill) {
            imageProps.width = width;
            imageProps.height = height;
        }

        return (
            <NextImage {...imageProps} />
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
            onLoad={() => setLoaded(true)}
            {...legacyProps}
        />
    );
};

export default Image;
