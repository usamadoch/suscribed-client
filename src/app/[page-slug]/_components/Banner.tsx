

"use client";

import React, { useCallback } from "react";
import Image from "@/components/Image";

import { usePageImageUpload } from "@/hooks/usePageImageUpload";

import { CreatorPage } from "@/lib/types";

import PageImageUploader from "./PageImageUploader";

type CreatorBannerProps = {
    page: CreatorPage;
    isOwner: boolean;
    onUpdate?: (type: 'banner', url: string) => void;
};

const Banner = ({ page, isOwner, onUpdate }: CreatorBannerProps) => {
    const handleSuccess = useCallback((type: 'banner' | 'avatar', url: string) => {
        if (type === 'banner' && onUpdate) {
            onUpdate('banner', url);
        }
    }, [onUpdate]);

    const {
        uploadImage,
        optimisticBanner,
        uploadingType
    } = usePageImageUpload({
        onUploadSuccess: handleSuccess
    });

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isOwner) return;
        const file = e.target.files?.[0];
        if (file) await uploadImage(file, 'banner');
    };

    return (
        <div className="relative  w-full h-80 md:h-52 bg-n-2">
            {isOwner ? (
                <PageImageUploader
                    containerClassName="w-full h-full"
                    imageSrc={optimisticBanner || page.bannerUrl}

                    alt="Banner"
                    onFileChange={handleBannerUpload}
                    isLoading={uploadingType === 'banner'}
                    family="banner"
                    slot="creatorPage"
                />
            ) : (
                <Image
                    className="object-cover"
                    family="banner"
                    slot="creatorPage"
                    src={page.bannerUrl}
                    fill
                    alt="Banner"
                    priority
                />
            )}
        </div>
    );
};

export default Banner;
