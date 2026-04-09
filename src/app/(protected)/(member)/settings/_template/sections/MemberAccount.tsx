import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { useAuth } from "@/store/auth";
import { userApi } from "@/lib/api";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useFullProfile } from "@/hooks/useQueries";
import Alert from "@/components/Alert";

type AccountFormValues = {
    displayName: string;
    username: string;
    bio: string;
};

const MemberAccount = () => {
    const { user, refreshUser } = useAuth();
    const { data: fullUser } = useFullProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // For local preview of avatar if user changes it
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<AccountFormValues>({
        defaultValues: {
            displayName: "",
            username: "",
            bio: "",
        },
    });

    // Populate form when full profile loads
    useEffect(() => {
        if (fullUser) {
            reset({
                displayName: fullUser.displayName || "",
                username: fullUser.username || "",
                bio: fullUser.bio || "",
            });
        }
    }, [fullUser, reset]);

    const bio = watch("bio");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewAvatar(objectUrl);
            setSelectedFile(file);
        }
    };

    const { uploadImage, isUploading: isUploadingImage } = useImageUpload();

    const onSubmit = async (data: AccountFormValues) => {
        setIsLoading(true);
        setMessage(null);

        try {
            let avatarUrl = fullUser?.avatarUrl || user?.avatarUrl || undefined;

            // 1. Upload avatar if selected
            if (selectedFile) {
                const url = await uploadImage(selectedFile, 'avatar');
                if (url) {
                    avatarUrl = url;
                } else {
                    throw new Error("Failed to upload image");
                }
            }

            // 2. Update User Profile
            await userApi.updateMe({
                displayName: data.displayName,
                username: data.username,
                bio: data.bio,
                avatarUrl,
            });

            // 3. Refresh local user state
            await refreshUser();

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setSelectedFile(null); // Reset file selection
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-title">Profile Settings</div>
            <div className="">
                <div className="p-5">
                    {message && (
                        <Alert
                            type={message.type}
                            message={message.text}
                            onClose={() => setMessage(null)}
                        />
                    )}
                    <div className="flex items-center w-[calc(50%-1.5rem)] -mt-2 mx-3 md:w-full md:mb-6 md:mt-0 md:mx-0 md:last:mb-0">
                        <div className="mt-8 relative shrink-0 w-27.5 h-27.5 mr-3 cursor-pointer rounded-full group" onClick={handleAvatarClick}>
                            <Image
                                className="object-cover rounded-full"
                                src={(previewAvatar || user?.avatarUrl || "/images/avatars/avatar-1.jpg") as string}
                                fill
                                alt="Avatar"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 rounded-full border-2 border-transparent hover:bg-n-3/5 dark:hover:bg-n-1/10 dark:border-n-9">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-n-2 text-n-1 dark:text-n-9">
                                    <Icon name="upload" className="w-4 h-4 fill-n-1" />
                                </div>
                            </div>
                        </div>
                        <div className="grow">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif"
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                        <div className="flex flex-wrap -mt-4 -mx-2.5">
                            <Field
                                className="w-[calc(50%-1.25rem)] mx-2.5 mt-4"
                                label="Display Name"
                                classInput="h-12 border-n-4"
                                placeholder="Enter display name"
                                error={errors.displayName}
                                {...register("displayName", { required: "Display name is required" })}
                            />
                            <Field
                                className="w-[calc(50%-1.25rem)] mx-2.5 mt-4"
                                label="Username"
                                placeholder="Enter username"
                                classInput="h-12 border-n-4"
                                error={errors.username}
                                {...register("username", { required: "Username is required" })}
                            />
                            <Field
                                className="w-[calc(100%-1.25rem)] mt-4 mx-2.5"
                                label={`Bio (${bio?.length || 0}/500)`}
                                placeholder="Enter bio"
                                classInput=" border-n-4"
                                textarea
                                maxLength={500}
                                {...register("bio", { maxLength: 500 })}
                            />
                        </div>

                        <div className="flex justify-between mt-16 md:block md:mt-8">
                            <button
                                type="submit"
                                className="btn-medium btn-purple min-w-[11.7rem] md:w-full"
                                disabled={isLoading}
                            >
                                Update Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MemberAccount;
