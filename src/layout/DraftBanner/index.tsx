"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCreatorPage } from "@/hooks/queries";

import Loader from "@/components/Loader";
import PublishModal from "@/components/modals/PublishModal";

import { pageService as pageApi } from "@/services/page.service";



const DraftBanner = () => {
    const params = useParams();
    const slug = params?.['page-slug'] as string;
    const queryClient = useQueryClient();
    const [showPublishModal, setShowPublishModal] = useState(false);

    const { data } = useCreatorPage(slug);
    const { page, isOwner } = data || {};

    const publishMutation = useMutation({
        mutationFn: async () => {
            return await pageApi.updateMyPage({ status: 'published' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creator-page', slug] });
            queryClient.invalidateQueries({ queryKey: ['explore-creators'] });
            setShowPublishModal(false);
        }
    });

    const isDraft = page?.status === 'draft';
    // Only show banner if owner and draft
    const showDraftBanner = isOwner && isDraft;

    // Check for missing fields for warning
    const missingFields: string[] = [];
    if (page && !page.bannerUrl) missingFields.push('Banner image');
    if (page && !page.avatarUrl) missingFields.push('Profile picture');
    if (page && !page.about) missingFields.push('About section');

    if (!showDraftBanner) return null;

    return (
        <>
            <div className="w-full py-2 px-4 bg-[#daf464] text-n-1 z-40 relative">
                <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-medium">Your page is unpublished. Only you can see it.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPublishModal(true)}
                                className="btn-purple btn-small px-8 mb-1 bg-white shadow-primary-4 rounded-sm hover:shadow-none hover:bg-white transition-shadow duration-100 cursor-pointer"
                            >
                                Publish Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PublishModal
                visible={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                missingFields={missingFields}
                onPublish={() => publishMutation.mutate()}
                isPending={publishMutation.isPending}
            />
        </>
    );
};

export default DraftBanner;
