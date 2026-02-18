import React, { useRef } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { SlotFamily, SlotName } from "@/lib/image-slots";

interface PageImageUploaderProps<F extends SlotFamily> {
    imageSrc: string | null | undefined;
    alt: string;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    containerClassName?: string;
    imageClassName?: string;
    children?: React.ReactNode;
    iconClassName?: string;
    uploadIconWrapperClassName?: string;
    isLoading?: boolean;
    // Required slot props
    family: F;
    slot: SlotName<F>;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

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
        family,
        slot
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!isLoading) {
            inputRef.current?.click();
        }
    };

    return (
        <div className={`relative group cursor-pointer ${containerClassName}`} onClick={handleClick}>
            {imageSrc ? (
                <Image
                    className={imageClassName}
                    family={family}
                    slot={slot}
                    src={imageSrc}
                    fill
                    alt={alt}
                />
            ) : (
                <div className={`w-full h-full flex items-center justify-center bg-n-2 ${imageClassName?.includes('rounded') ? 'rounded-full' : ''}`}>
                    <Icon name={family === 'avatar' && 'profile'} className="w-8 h-8 fill-n-4/50 relative z-10" />
                </div>
            )
            }

            {/* Hover/Loading Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity border-2 border-transparent z-20 
                ${isLoading ? 'opacity-100 bg-black/50' : 'opacity-0 group-hover:opacity-100 hover:bg-n-3/5 dark:hover:bg-white/10 dark:border-white'} 
                ${imageClassName?.includes("rounded-full") ? "rounded-full" : ""}`}>

                {isLoading ? (
                    <Loader className="text-white" />
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
        </div >
    );
}

export default PageImageUploader;
