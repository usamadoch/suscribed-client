"use client";

import React, { useState, useCallback } from "react";

import Image from "@/components/Image";
import ProfileSocials from "./ProfileSocials";
import ProfileHeaderActions from "./ProfileHeaderActions";
import LoginModal from "@/components/modals/LoginModal";
import ShareModal from "@/components/modals/ShareModal";
import JoinTierModal from "@/components/modals/JoinTierModal";
import ReadMore from "@/components/ReadMore";

import { CreatorPage } from "@/lib/types";

import { usePageImageUpload } from "@/hooks/usePageImageUpload";

import { useAuth } from "@/store/auth";
import { useJoinPage } from "@/hooks/useQueries";
import PageImageUploader from "./PageImageUploader";


type CreatorProfileHeaderProps = {
    page: CreatorPage;
    isOwner: boolean;
    isMember: boolean;
    onUpdate?: (type: 'avatar', url: string) => void;
    onJoinSuccess?: () => void;
};

const ProfileHeader = ({ page, isOwner, isMember, onUpdate, onJoinSuccess }: CreatorProfileHeaderProps) => {
    const { isAuthenticated } = useAuth();
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleSuccess = useCallback((type: 'banner' | 'avatar', url: string) => {
        if (type === 'avatar' && onUpdate) {
            onUpdate('avatar', url);
        }
    }, [onUpdate]);

    const {
        uploadImage,
        optimisticAvatar,
        uploadingType
    } = usePageImageUpload({
        onUploadSuccess: handleSuccess
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isOwner) return;
        const file = e.target.files?.[0];
        if (file) await uploadImage(file, 'avatar');
    };

    const handleOpenJoinModal = () => {
        if (!isAuthenticated) return setIsLoginModalOpen(true);
        setIsJoinModalOpen(true);
    };

    const handleJoinForFree = async () => {
        if (!page) return;

        const creatorId = typeof page.userId === 'object' ? page.userId._id : page.userId;
        joinPage({ creatorId, pageId: page._id }, {
            onSuccess: () => {
                setIsJoinModalOpen(false);
                if (onJoinSuccess) onJoinSuccess();
            }
        });
    };


    return (
        <div className="relative z-1 flex items-end h-full pb-10 px-16 2xl:px-8 lg:px-6 md:px-5 md:pb-8">
            <div className="flex items-start justify-between w-full pt-4">
                <div className="flex flex-1 items-start">
                    {/* Avatar Section */}
                    <div className="relative shrink-0 w-27.5 h-27.5">
                        {/* {(optimisticAvatar || page.avatarUrl) && (
                            <div className="absolute top-1 left-1 w-full h-full rounded-full bg-[#4ADBC8] border border-black"></div>
                        )} */}
                        <div className="relative w-full h-full rounded-full z-10">
                            {isOwner ? (
                                <PageImageUploader
                                    containerClassName="w-full h-full rounded-full"
                                    imageClassName="object-cover rounded-full"
                                    imageSrc={optimisticAvatar || page.avatarUrl}

                                    alt="Avatar"
                                    onFileChange={handleAvatarUpload}
                                    uploadIconWrapperClassName="w-8 h-8"
                                    iconClassName="w-4 h-4 fill-n-1"
                                    isLoading={uploadingType === 'avatar'}
                                    family="avatar"
                                    slot="profile"
                                />
                            ) : (
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                        className="object-cover"
                                        family="avatar"
                                        slot="profile"
                                        src={page?.avatarUrl}
                                        fill
                                        alt="Avatar"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-n-1 dark:text-white pl-4">
                        <h5 className="capitalize mb-4 text-h5 md:text-h3">{page.displayName}</h5>
                        <div className="flex items-center font-medium text-n-3">
                            <span className="text-sm mr-2 md:mr-4">{page.memberCount || 0} Members</span>
                            <span className="text-sm">{page.postCount || 0} Posts</span>
                        </div>
                        <p className="mt-1 text-base text-n-3 ">
                            <ReadMore words={20} >
                                {page.tagline || page.about || "No description available."}
                            </ReadMore>
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-end  shrink-0">
                    {page.socialLinks && page.socialLinks.length > 0 && (
                        <ProfileSocials socialLinks={page.socialLinks} />
                    )}

                    <ProfileHeaderActions
                        isOwner={isOwner}
                        isMember={isMember}
                        onJoinClick={handleOpenJoinModal}
                        onShareClick={() => setVisible(true)}
                    />
                </div>
            </div>
            <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            <JoinTierModal
                visible={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                page={page}
                onJoin={handleJoinForFree}
                isJoining={isJoining}
            />

            <ShareModal
                visible={visible}
                onClose={() => setVisible(false)}
                shareUrl={`/${page.pageSlug}`}
                bannerUrl={page.bannerUrl}
                avatarUrl={page.avatarUrl}
            />

        </div>
    );
};

export default ProfileHeader;
