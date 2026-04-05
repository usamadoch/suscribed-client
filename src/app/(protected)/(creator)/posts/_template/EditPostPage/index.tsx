
"use client"

import { usePost } from "@/hooks/useQueries";
import { useRouter } from "next/navigation";
import { useEffect, use, useState } from "react";
import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal";
import { usePostForm } from "../NewPostPage/usePostForm";
import PostForm from "../NewPostPage/components/PostForm";
import { useHeader } from "@/context/HeaderContext";
import Loader from "@/components/Loader";




type EditPostProps = {
    params: Promise<{
        id: string;
    }>;
};

const EditPostPage = ({ params }: EditPostProps) => {
    const { id } = use(params);

    const { data: post, isLoading, isError } = usePost(id);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const router = useRouter();

    const formState = usePostForm({
        initialData: post || undefined,
        isEditing: true
    });

    const { isDirty } = formState;

    const handleBack = () => {
        if (isDirty) {
            setPendingNavigation('back');
            setShowUnsavedModal(true);
        } else {
            router.back();
        }
    };

    const { setHeaderConfig } = useHeader({ title: "Edit Post", createBtn: false, back: true, onBack: handleBack });

    // Handle browser back/refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);


    // Keep header onBack in sync with latest handleBack
    useEffect(() => {
        setHeaderConfig({ onBack: handleBack });
    }, [isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

    const confirmNavigation = () => {
        setShowUnsavedModal(false);
        if (pendingNavigation === 'back') {
            router.back();
        }
        // Add other navigation types if needed
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader />
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="text-center py-20">
                <div className="h4 mb-4">Post not found</div>
                <button className="btn-purple" onClick={() => router.push('/posts')}>
                    Go back to posts
                </button>
            </div>
        );
    }
    return (
        <>
            <PostForm formState={formState} submitLabel="Update Post" />

            <UnsavedChangesModal
                visible={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onConfirm={confirmNavigation}
            />
        </>
    );
};




export default EditPostPage;
