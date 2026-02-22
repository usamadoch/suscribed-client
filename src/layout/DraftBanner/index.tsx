"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCreatorPage } from "@/hooks/useQueries";

import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

import { pageApi } from "@/lib/api";



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

    console.log(page);

    // Check for missing fields for warning
    const missingFields: string[] = [];
    if (page && !page.bannerUrl) missingFields.push('Banner image');
    if (page && !page.avatarUrl) missingFields.push('Profile picture');
    if (page && !page.about) missingFields.push('About section');

    if (!showDraftBanner) return null;

    return (
        <>
            <div className="w-full bg-yellow-100 border-b border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 py-3 px-4 z-40 relative">
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Draft</span>
                            <span className="font-medium">Your page is unpublished. Only you can see it.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPublishModal(true)}
                                className="btn-purple btn-medium bg-yellow-600 hover:bg-yellow-700 px-12"
                            >
                                Publish Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                visible={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                title="Publish Page"
            >
                <div className="space-y-4">
                    <p className="text-sm text-n-2">
                        Are you sure you want to publish your page? It will become visible to everyone.
                    </p>

                    {missingFields.length > 0 && (
                        <div className=" p-4  bg-purple-1/20 border border-n-1 shadow-primary-4 ">
                            <h6 className="text-n-2 text-h6 dark:text-purple-200 font-medium mb-2 flex items-center gap-2">
                                <span className="text-lg">⚠️</span> Complete your profile
                            </h6>
                            <p className="text-sm text-n-2 dark:text-purple-300 mb-2">
                                Your page is looking a bit empty! Consider adding the following before publishing:
                            </p>
                            <ul className="list-disc pl-5 text-sm font-medium text-n-2 dark:text-purple-300 space-y-1">
                                {missingFields.map(field => (
                                    <li key={field}>{field}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6 pt-4 border-t border-n-3/10">

                        <button
                            className="btn-stroke w-full btn-medium px-10"
                            type="button"
                            onClick={() => setShowPublishModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn-purple w-full btn-medium px-10 md:bg-transparent! md:border-none md:w-6 md:h-6 md:p-0 md:text-0"

                            onClick={() => publishMutation.mutate()}
                            disabled={publishMutation.isPending}
                        >
                            {publishMutation.isPending ? <Loader /> : 'Publish'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DraftBanner;
