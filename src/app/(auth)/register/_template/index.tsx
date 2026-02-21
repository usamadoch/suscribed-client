

"use client"
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Step1Account from "./steps/Step1Account";
import Step2CreatorDetails from "./steps/Step2CreatorDetails";
import Step3Category from "./steps/Step3Category";
import Step4Socials from "./steps/Step4Socials";
import Loader from "@/components/Loader";

import { SignUpFormValues, SignUpSchema } from "../../_validations";
import { useAuthStore } from "@/store/auth";
import { ONBOARDING_STEPS } from "@/lib/types";

const STEPS = {
    ACCOUNT: 1,
    DETAILS: 2,
    CATEGORY: 3,
    SOCIALS: 4,
};

// Map server onboardingStep to which wizard step to show next
function getInitialStep(onboardingStep?: number): number {
    switch (onboardingStep) {
        case 1: return STEPS.DETAILS;   // Account created → show details
        case 2: return STEPS.CATEGORY;  // Details done → show category
        case 3: return STEPS.SOCIALS;   // Category done → show socials
        default: return STEPS.ACCOUNT;  // Not started or undefined
    }
}

const RegistrationPage = () => {
    const user = useAuthStore((s) => s.user);
    const isAuthLoading = useAuthStore((s) => s.isLoading);
    const [step, setStep] = useState<number>(STEPS.ACCOUNT);
    const [ready, setReady] = useState(false);

    // Wait for auth to finish loading, then set the correct step
    useEffect(() => {
        if (!isAuthLoading && !ready) {
            if (user?.onboardingStep && user.onboardingStep > 0 && user.onboardingStep < ONBOARDING_STEPS.COMPLETE) {
                setStep(getInitialStep(user.onboardingStep));
            }
            setReady(true);
        }
    }, [isAuthLoading, user, ready]);

    const methods = useForm<SignUpFormValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            displayName: "",
            password: "",
            creatorName: "",
            pageSlug: "",
            category: [],
            socialLinks: [{ value: "" }],
        },
        mode: "onChange"
    });

    const onNext = () => setStep((prev) => prev + 1);
    const onBack = () => setStep((prev) => prev - 1);

    // Don't render the form until we know which step to show
    if (!ready) {
        return (
            <div className="w-full max-w-120 mx-auto flex justify-center items-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full max-w-120 mx-auto">

            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()}>
                    {step === STEPS.ACCOUNT && <Step1Account onNext={onNext} />}
                    {step === STEPS.DETAILS && <Step2CreatorDetails onNext={onNext} onBack={onBack} />}
                    {step === STEPS.CATEGORY && <Step3Category onNext={onNext} onBack={onBack} />}
                    {step === STEPS.SOCIALS && <Step4Socials onBack={onBack} />}
                </form>
            </FormProvider>
        </div>
    );
};

export default RegistrationPage;
