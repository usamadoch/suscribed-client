import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { useMyPage } from "@/hooks/useQueries";
import { usePageImageUpload } from "@/hooks/usePageImageUpload";


import { useAuth } from "@/store/auth";

import { getPlatformFromUrl } from "@/lib/utils";
import { pageApi } from "@/lib/api";
import { UpdatePagePayload, CreatorPage } from "@/lib/types";

import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Loader from "@/components/Loader";
import Categories from "../components/Categories";
import Alert from "@/components/Alert";
import PageImageUploader from "@/app/(public)/[page-slug]/_components/PageImageUploader";

// Constants
const SPECIFICATION_OPTIONS = [
    { id: "0", title: "Gaming" },
    { id: "1", title: "Art & Design" },
    { id: "2", title: "Music" },
    { id: "3", title: "Technology" },
    { id: "4", title: "Education" },
    { id: "5", title: "Entertainment" },
    { id: "6", title: "Other" },
];

// Types
type AccountFormValues = {
    creatorName: string;
    pageSlug: string;
    about: string;
    category: string[];
    socialLinks: { value: string }[];
};

type SpecificationOption = {
    id: string;
    title: string;
};

// Custom Hook: Manage Creator Profile Data Logic
// ----------------------------------------------------------------------
const useCreatorProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Use cached query
    const { data: page, isLoading } = useMyPage();

    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfile = async (data: Partial<UpdatePagePayload>) => {
        setIsUpdating(true);
        try {
            const res = await pageApi.updateMyPage(data as UpdatePagePayload);

            // Update cache immediately if successful
            if (res?.page) {
                queryClient.setQueryData(['my-creation-page', user?._id], res.page);
                // Also update the public page cache if slug might have changed
                queryClient.invalidateQueries({ queryKey: ['creator-page'] });
            }
            return { success: true };
        } catch (error) {
            console.error("Failed to update profile", error);
            return { success: false, error };
        } finally {
            setIsUpdating(false);
        }
    };

    // Callback to update local state after successful image upload
    const handleImageUpdateSuccess = useCallback((type: 'banner' | 'avatar', url: string) => {
        // We use 'CreatorPage' or 'any' if not strictly imported. Ideally strictly typed.
        // Assuming CreatorPage is the type of the cached data.
        queryClient.setQueryData(['my-creation-page', user?._id], (old: CreatorPage | undefined) => {
            if (!old) return old;
            return {
                ...old,
                [type === 'banner' ? 'bannerUrl' : 'avatarUrl']: url
            };
        });
        // Invalidate public page to reflect changes
        queryClient.invalidateQueries({ queryKey: ['creator-page'] });
    }, [queryClient, user]);

    return {
        page,
        isLoading,
        isUpdating,
        updateProfile,
        handleImageUpdateSuccess
    };
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const CreatorAccount = () => {
    const {
        page,
        isLoading,
        isUpdating,
        updateProfile,
        handleImageUpdateSuccess
    } = useCreatorProfile();

    const {
        uploadImage,
        optimisticBanner,
        optimisticAvatar,
        isUploading: isUploadingImage,
        uploadingType,
    } = usePageImageUpload({
        onUploadSuccess: handleImageUpdateSuccess
    });




    // Form setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        reset,
        formState: { errors },
    } = useForm<AccountFormValues>({
        defaultValues: {
            creatorName: "",
            pageSlug: "",
            about: "",
            category: [],
            socialLinks: [{ value: "" }],
        },
    });

    // Populate form tracking initial ID to avoid resets on local updates
    const [initialPageId, setInitialPageId] = useState<string | null>(null);

    useEffect(() => {
        if (page && page._id !== initialPageId) {
            setInitialPageId(page._id);
            reset({
                creatorName: page.displayName || "",
                pageSlug: page.pageSlug || "",
                about: page.about || "",
                category: page.category || [],
                socialLinks: page.socialLinks?.length
                    ? page.socialLinks.map((link) => ({ value: link.url }))
                    : [{ value: "" }],
            });
        }
    }, [page, initialPageId, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks",
    });

    const about = watch("about");
    const category = watch("category");

    // Handlers
    const handleCategoryChange = (item: SpecificationOption) => {
        if (category && !category.includes(item.title)) {
            setValue("category", [...category, item.title], { shouldDirty: true });
        }
    };

    const handleCategoryRemove = (index: number) => {
        const newCats = [...(category || [])];
        newCats.splice(index, 1);
        setValue("category", newCats, { shouldDirty: true });
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // No need to manually setIsUploading if we trust the hook, but for now we might want to block global submit
        await uploadImage(file, 'banner');
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadImage(file, 'avatar');
    };

    const onSubmit = async (data: AccountFormValues) => {
        const socialLinksPayload = data.socialLinks
            .map(link => link.value.trim())
            .filter(val => val !== "")
            .map(url => ({
                platform: getPlatformFromUrl(url),
                url: url
            }));

        const updateData = {
            displayName: data.creatorName,
            pageSlug: data.pageSlug,
            about: data.about,
            category: data.category,
            socialLinks: socialLinksPayload
        };

        const res = await updateProfile(updateData);
        if (res.success) {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="success"
                    message="Creator profile updated successfully"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        } else {
            toast.custom((t) => (
                <Alert
                    className="mb-0 shadow-md"
                    type="error"
                    message="Failed to update profile"

                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center pt-10">
                <Loader />
            </div>
        )
    }

    return (
        <>

            <div className="card">
                <div className="card-title">Profile Settings</div>
                <div className="">
                    {/* Banner Image */}
                    <PageImageUploader
                        containerClassName="w-full aspect-[5/1] bg-n-2"
                        imageSrc={optimisticBanner || page?.bannerUrl}

                        alt="Banner"
                        onFileChange={handleBannerUpload}
                        isLoading={uploadingType === 'banner'}

                        family="banner"
                        slot="profileHeader"
                    />

                    <div className="p-5">
                        <div className="flex items-center w-[calc(50%-1.5rem)] mx-3 md:w-full md:mb-6 md:mt-0 md:mx-0 md:last:mb-0">
                            {/* Avatar Image */}
                            <div className="-mt-20 relative shrink-0 w-24 h-24 mr-3">
                                <PageImageUploader
                                    containerClassName="w-full h-full shadow-primary-4 rounded-full"
                                    imageClassName="object-cover rounded-full"
                                    imageSrc={optimisticAvatar || page?.avatarUrl}

                                    alt="Avatar"
                                    onFileChange={handleAvatarUpload}
                                    uploadIconWrapperClassName="w-8 h-8"
                                    iconClassName="w-4 h-4 fill-n-1"
                                    isLoading={uploadingType === 'avatar'}

                                    family="avatar"
                                    slot="profile"
                                />
                            </div>

                            <div className="grow">
                                {/* Extra text or info could go here if needed */}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                            <div className="flex flex-wrap -mt-4 -mx-2.5">
                                <Field
                                    className="w-[calc(50%-1.25rem)] mx-2.5 mt-4"
                                    classInput="h-12"
                                    label="Creator Name"
                                    error={errors.creatorName}
                                    {...register("creatorName", { required: "Creator name is required" })}
                                />

                                <Field
                                    className="w-[calc(50%-1.25rem)] mx-2.5 mt-4 "
                                    label="Profile URL"

                                    prefix="example.com/"
                                    classInput="pl-[7.5rem] h-12"
                                    icon="link"
                                    error={errors.pageSlug}
                                    {...register("pageSlug", { required: "Profile slug is required" })}
                                />

                                <Field
                                    className="w-[calc(100%-1.25rem)]  mt-4 mx-2.5"
                                    label={`About your page (${about?.length || 0}/500)`}
                                    textarea
                                    maxLength={500}
                                    {...register("about", { maxLength: 500 })}
                                />

                                <div className="w-full mt-4 mx-2.5">
                                    <Categories
                                        label="Categories"
                                        items={category || []}
                                        options={SPECIFICATION_OPTIONS}
                                        onChange={handleCategoryChange}
                                        onRemove={handleCategoryRemove}
                                    />
                                </div>

                                {/* Social Links Section */}
                                <div className="w-[calc(100%-1.25rem)] mt-8 mx-2.5">
                                    <div className="mb-3 text-h6 font-bold">Social Links</div>
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="relative">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <div className="text-xs font-bold">New Link</div>
                                                    <button
                                                        type="button"
                                                        className="group flex items-center text-xs font-bold hover:text-pink-1 transition-colors"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Icon name="trash" className="mr-1.5 w-4 h-4 fill-n-3 transition-colors group-hover:fill-pink-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                                <Field
                                                    className="w-full"
                                                    classInput="h-12"
                                                    {...register(`socialLinks.${index}.value` as const)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {fields.length < 4 && (
                                        <button
                                            type="button"
                                            className="group inline-flex items-center font-bold transition-colors hover:text-purple-1 mt-4"
                                            onClick={() => append({ value: "" })}
                                        >
                                            <Icon name="add-circle" className="icon-18 mr-1.5 transition-colors group-hover:fill-purple-1 dark:fill-white dark:group-hover:fill-purple-1" />
                                            Add Another
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between mt-16 md:block md:mt-8">
                                <button
                                    type="submit"
                                    className=" btn-medium btn-purple min-w-[11.7rem] md:w-full"
                                    disabled={isUpdating || isUploadingImage}
                                >
                                    {
                                        isUpdating ? (
                                            <Loader className="w-6 h-6 text-white" />
                                        ) : (
                                            "Update Settings"
                                        )
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatorAccount;
