
"use client";

import { useCallback, useEffect } from "react";
import { notFound } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";
import { useCreatorPage } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";
import { type CreatorPage as CreatorPageType } from "@/lib/types";
import { ApiClientError } from "@/lib/api";

import { useCreatorHeader } from "@/context/CreatorHeaderContext";

import Banner from "../_components/Banner";
import ProfileHeader from "../_components/ProfileHeader";
import Content from "../_components/Content";
import Loader from "@/components/Loader";


const CreatorPage = () => {
    const slug = usePageSlug();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { setHeaderHidden } = useCreatorHeader();

    // ... hooks ...

    const { data, isLoading, error } = useCreatorPage(slug);
    const { page, isOwner, isMember } = data || {};

    useEffect(() => {
        if (error && error instanceof ApiClientError && (error.code === 'NOT_PUBLISHED' || error.code === 'NOT_FOUND')) {
            setHeaderHidden(true);
        } else {
            setHeaderHidden(false);
        }
        return () => setHeaderHidden(false);
    }, [error, setHeaderHidden]);

    const handleImageSuccess = useCallback((type: 'banner' | 'avatar', url: string) => {
        type PageData = { page: CreatorPageType; isOwner: boolean; isMember: boolean };
        queryClient.setQueryData(['creator-page', slug, user?._id], (old: PageData | undefined) => {
            if (!old || !old.page) return old;
            return {
                ...old,
                page: {
                    ...old.page,
                    [type === 'banner' ? 'bannerUrl' : 'avatarUrl']: url
                }
            };
        });
    }, [queryClient, slug, user?._id]);

    const handleJoinSuccess = useCallback(() => {
        type PageData = { page: CreatorPageType; isOwner: boolean; isMember: boolean };
        queryClient.setQueryData(['creator-page', slug, user?._id], (old: PageData | undefined) => {
            if (!old) return old;
            return {
                ...old,
                isMember: true,
                page: {
                    ...old.page,
                    memberCount: (old.page.memberCount || 0) + 1
                }
            };
        });
    }, [queryClient, slug, user?._id]);

    if (error && error instanceof ApiClientError && (error.code === 'NOT_PUBLISHED' || error.code === 'NOT_FOUND')) {
        return (
            <div className="flex items-center justify-center h-screen bg-n-1 text-white">
                <div className="text-center">
                    <h1 className="text-h3 mb-2">
                        {error.code === 'NOT_PUBLISHED' ? 'Page Not Published Yet' : 'Page Not Found'}
                    </h1>
                    <p className="text-n-3">
                        {error.code === 'NOT_PUBLISHED'
                            ? "This creator page is currently in draft mode and hasn't been published yet."
                            : "The page you are looking for does not exist."}
                    </p>
                </div>
            </div>
        );
    }


    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader text="Loading..." />
            </div>
        );
    }

    if (!page) {
        setHeaderHidden(true);
        notFound();
    }

    // Check for missing fields for warning
    const missingFields: string[] = [];
    if (!page.bannerUrl) missingFields.push('Banner image');
    if (!page.avatarUrl) missingFields.push('Profile picture');
    if (!page.about) missingFields.push('About section');

    return (
        <>
            {/* CreatorHeader removed from here, now in layout */}


            <Banner
                page={page}
                isOwner={!!isOwner}
                onUpdate={handleImageSuccess}
            />

            <div className="max-w-360 mx-auto">
                <ProfileHeader
                    page={page}
                    isOwner={!!isOwner}
                    isMember={!!isMember}
                    onUpdate={handleImageSuccess}
                    onJoinSuccess={handleJoinSuccess}
                />

                {/* Content section handles its own loading */}
                <Content pageSlug={slug} />
            </div>
        </>
    );
};

export default CreatorPage;

