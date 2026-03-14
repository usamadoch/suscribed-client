"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";

import { useAuth } from "@/store/auth";
import { useCreatorPage } from "@/hooks/useQueries";
import { usePageSlug } from "@/hooks/usePageSlug";
import { useCreatorPageCache } from "@/hooks/useCreatorPageCache";
import { ApiClientError } from "@/lib/api";

import { useCreatorHeader } from "@/context/CreatorHeaderContext";

import Banner from "../_components/Banner";
import ProfileHeader from "../_components/ProfileHeader";
import Content from "../_components/Content";
import CreatorPageError from "../_components/CreatorPageError";
import Loader from "@/components/Loader";


const CreatorPage = () => {
    const slug = usePageSlug();
    const { user } = useAuth();

    const { setHeaderHidden } = useCreatorHeader();
    const { handleImageSuccess, handleJoinSuccess } = useCreatorPageCache(slug, user?._id);

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

    if (error && error instanceof ApiClientError && (error.code === 'NOT_PUBLISHED' || error.code === 'NOT_FOUND')) {
        return <CreatorPageError code={error.code} />;
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

            <div className="max-w-300 mx-auto">
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
