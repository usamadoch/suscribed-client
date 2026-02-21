import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";


import Field from "@/components/Field";
import Alert from "@/components/Alert";
import StepActions from "./StepActions";

import { slugify } from "@/lib/utils";

import { SignUpFormValues } from "@/app/(auth)/_validations";
import { pageApi, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { ONBOARDING_STEPS } from "@/lib/types";



type Step2Props = {
    onNext: () => void;
    onBack: () => void;
};

const Step2CreatorDetails = ({ onNext, onBack }: Step2Props) => {
    const { register, watch, setValue, trigger, getValues, formState: { errors } } = useFormContext<SignUpFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const creatorName = watch("creatorName");

    // Auto-generate slug when creator name changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (creatorName) {
                const slug = slugify(creatorName);
                setValue("pageSlug", slug, { shouldValidate: true });
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timer);
    }, [creatorName, setValue]);

    const handleNext = async () => {
        setError(null);
        setIsLoading(true);
        const valid = await trigger(["creatorName", "pageSlug"]);

        if (valid) {
            const { creatorName, pageSlug } = getValues();
            try {
                await pageApi.updateMyPage({
                    displayName: creatorName,
                    pageSlug
                });
                // Persist onboarding progress
                const { user } = await authApi.updateOnboardingStep(ONBOARDING_STEPS.DETAILS_DONE);
                useAuthStore.setState((s) => ({ user: { ...s.user!, onboardingStep: user.onboardingStep } }));
                // Invalidate cache to reflect new slug elsewhere
                await queryClient.invalidateQueries({ queryKey: ['my-creation-page'] });
                onNext();
            } catch (err: any) {
                console.error("Failed to update page details", err);

                // If the error suggests page not found, it means the page wasn't created during signup.
                // We could try to create it here or just show an error.
                // For this quick fix, let's show an error.
                if (err.status === 404) {
                    setError("Your creator page could not be found. Please try refreshing or logging in again.");
                } else {
                    setError("Failed to save details. Please try again.");
                }
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h4 className="mb-5 text-h4">Creator Profile</h4>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    className="mb-4"
                    onClose={() => setError(null)}
                />
            )}

            <Field
                className="mb-4"
                // label="Creator Name"
                classInput="h-12"

                placeholder="Creator Name"
                icon="profile"
                error={errors.creatorName}
                {...register("creatorName")}
                autoFocus
            />
            <Field
                className="mb-4"
                // label="Profile URL"
                placeholder="my-page"
                prefix="suscribed.co/"
                classInput="h-12"
                icon="link"
                error={errors.pageSlug}
                {...register("pageSlug")}
            />
            <StepActions
                onNext={handleNext}
                onBack={onBack}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Step2CreatorDetails;










