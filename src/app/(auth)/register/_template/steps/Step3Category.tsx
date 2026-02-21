import { useState } from "react";
import { useFormContext } from "react-hook-form";

import StepActions from "./StepActions";

import { SignUpFormValues } from "@/app/(auth)/_validations";
import { pageApi, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { ONBOARDING_STEPS } from "@/lib/types";
import Alert from "@/components/Alert";

const CATEGORIES = [
    "Gaming",
    "Art & Design",
    "Music",
    "Technology",
    "Education",
    "Entertainment",
    "Other",
];

type Step3Props = {
    onNext: () => void;
    onBack: () => void;
};

const Step3Category = ({ onNext, onBack }: Step3Props) => {
    const { watch, setValue, trigger, getValues, formState: { errors } } = useFormContext<SignUpFormValues>();
    const selectedCategory = watch("category");
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = async () => {
        setIsLoading(true);
        const valid = await trigger("category");

        if (valid) {
            const { category } = getValues();
            try {
                await pageApi.updateMyPage({ category });
                // Persist onboarding progress
                const { user } = await authApi.updateOnboardingStep(ONBOARDING_STEPS.CATEGORY_DONE);
                useAuthStore.setState((s) => ({ user: { ...s.user!, onboardingStep: user.onboardingStep } }));
                onNext();
            } catch (error) {
                console.error("Failed to update category", error);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {errors.category && (
                <Alert
                    type="error"
                    message={errors.category.message}
                />
            )}

            <h4 className="mb-5 text-h4">Choose a category</h4>
            <div className="flex flex-wrap gap-4">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory?.includes(cat);
                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => {
                                const newCategories = isSelected
                                    ? selectedCategory.filter((c: string) => c !== cat)
                                    : [...(selectedCategory || []), cat];
                                setValue("category", newCategories, { shouldValidate: true });
                            }}
                            className={`btn-stroke btn-small h-12 px-8 
                            ${isSelected
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : ""
                                }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
            <StepActions
                onNext={handleNext}
                onBack={onBack}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Step3Category;