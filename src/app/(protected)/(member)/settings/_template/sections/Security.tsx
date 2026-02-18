import { useState } from "react";
import { useForm } from "react-hook-form";

import { authApi } from "@/lib/api";

import Field from "@/components/Field";
import Loader from "@/components/Loader";

import { useAuth } from "@/store/auth";
import Alert from "@/components/Alert";

type SecurityProps = {};

const Security = ({ }: SecurityProps) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // If registered via Google, don't show password settings
    const isGoogleUser = !!user?.googleId;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPassword = watch("newPassword");

    interface ChangePasswordFormValues {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }

    const onSubmit = async (data: ChangePasswordFormValues) => {
        setIsLoading(true);
        try {
            await authApi.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            setMessage({ type: 'success', text: "Password updated successfully" });
            reset();
        } catch (error: unknown) {
            console.error("Failed to update password", error);
            const msg = error instanceof Error ? error.message : "Failed to update password";
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    if (isGoogleUser) {
        return (
            <div className="card">
                <div className="card-title">Security Settings</div>
                <div className="p-5 text-n-3 dark:text-white/75">
                    Your account is managed via Google Login. You don't need to set a password.
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-title">Security Settings</div>
            <div className="p-5">
                {message && (
                    <Alert
                        type={message.type}
                        message={message.text}
                        onClose={() => setMessage(null)}
                    />
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap -mt-4 -mx-2.5">
                        <Field
                            className="w-[calc(100%-1.25rem)] mt-4 mx-2.5"
                            label="Current Password"
                            type="password"
                            classInput="h-12"
                            placeholder="Enter current password"
                            error={errors.currentPassword}
                            {...register("currentPassword", { required: "Current password is required" })}
                        />
                        <Field
                            className="w-[calc(50%-1.25rem)] mt-4 mx-2.5 md:w-[calc(100%-1.25rem)]"
                            label="New Password"
                            type="password"
                            classInput="h-12"
                            placeholder="Enter new password"
                            error={errors.newPassword}
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                        />
                        <Field
                            className="w-[calc(50%-1.25rem)] mt-4 mx-2.5 md:w-[calc(100%-1.25rem)]"
                            label="Confirm New Password"
                            classInput="h-12"
                            type="password"
                            placeholder="Confirm new password"
                            error={errors.confirmPassword}
                            {...register("confirmPassword", {
                                required: "Please confirm your new password",
                                validate: (value) =>
                                    value === newPassword || "The passwords do not match",
                            })}
                        />
                    </div>

                    <div className="flex justify-between mt-16 md:block md:mt-8">
                        <button
                            type="submit"
                            className="btn-medium btn-purple min-w-[11.7rem] md:w-full"
                            disabled={isLoading}
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Security;
