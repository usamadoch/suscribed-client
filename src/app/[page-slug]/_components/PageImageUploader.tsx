import React, { useRef } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { SlotFamily, SlotName } from "@/lib/image-slots";

interface BaseUploaderProps {
    imageSrc: string | null | undefined;
    alt: string;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    containerClassName?: string;
    imageClassName?: string;
    children?: React.ReactNode;
    iconClassName?: string;
    uploadIconWrapperClassName?: string;
    isLoading?: boolean;
}

type LegacyUploaderProps = BaseUploaderProps & {
    fallbackSrc: string;
    family?: never;
    slot?: never;
};

type SlotUploaderProps<F extends SlotFamily> = BaseUploaderProps & {
    fallbackSrc?: never;
    family: F;
    slot: SlotName<F>;
};

type PageImageUploaderProps<F extends SlotFamily> = LegacyUploaderProps | SlotUploaderProps<F>;

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export function PageImageUploader(props: LegacyUploaderProps): React.ReactElement;
export function PageImageUploader<F extends SlotFamily>(props: SlotUploaderProps<F>): React.ReactElement;
export function PageImageUploader<F extends SlotFamily>(props: PageImageUploaderProps<F>) {
    const {
        imageSrc,
        alt,
        onFileChange,
        containerClassName = "",
        imageClassName = "object-cover",
        children,
        uploadIconWrapperClassName,
        iconClassName = "w-5 h-5 fill-n-1",
        isLoading = false,
    } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!isLoading) {
            inputRef.current?.click();
        }
    };

    // Helper to determine if we should use slot mode or legacy fallback logic
    // If family/slot provided, we use them.
    // If not, we might fallback to raw src.
    // However, Image component handles the fallback logic now mostly via slot.
    // If no family/slot, Image uses legacy mode (src directly).

    return (
        <div className={`relative group cursor-pointer ${containerClassName}`} onClick={handleClick}>
            {'family' in props && props.family ? (
                <Image
                    className={imageClassName}
                    family={props.family!}
                    slot={props.slot!}
                    src={imageSrc}
                    fill
                    alt={alt}
                />
            ) : (
                <Image
                    className={imageClassName}
                    src={imageSrc || (props as LegacyUploaderProps).fallbackSrc}
                    fill
                    alt={alt}
                />
            )}

            {/* Hover/Loading Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity border-2 border-transparent 
                ${isLoading ? 'opacity-100 bg-black/50' : 'opacity-0 group-hover:opacity-100 hover:bg-n-3/5 dark:hover:bg-white/10 dark:border-white'} 
                ${imageClassName.includes("rounded-full") ? "rounded-full" : ""}`}>

                {isLoading ? (
                    <Loader className="w-6 h-6 text-white" />
                ) : (
                    <div className={`flex items-center justify-center ${uploadIconWrapperClassName || "w-10 h-10"} rounded-full bg-white text-n-1`}>
                        <Icon name="upload" className={iconClassName} />
                    </div>
                )}
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={onFileChange}
                accept={ALLOWED_FILE_TYPES.join(', ')}
                disabled={isLoading}
            />
            {children}
        </div>
    );
}

export default PageImageUploader;
