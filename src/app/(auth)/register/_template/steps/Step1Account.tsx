



import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";


import GoogleButton from "@/components/GoogleButton";
import Alert from "@/components/Alert";

import StepActions from "./StepActions";
import AuthFields from "../../../_components/AuthFields";

import { useAuth, useAuthStore } from "@/store/auth";

import { SignUpFormValues } from "@/app/(auth)/_validations";

import { generateUsername } from "@/lib/utils";

type Step1Props = {
    onNext: () => void;
};

const Step1Account = ({ onNext }: Step1Props) => {
    const { register, trigger, getValues, setError, setValue, formState: { errors, touchedFields, dirtyFields } } = useFormContext<SignUpFormValues>();
    const { signup } = useAuth();
    const router = useRouter(); // Initialize router here
    const [isLoading, setIsLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);


    const handleNext = async () => {
        setIsLoading(true);
        const valid = await trigger(["email", "displayName", "password"]);

        if (valid) {
            const { email, password, displayName } = getValues();
            const username = generateUsername(displayName, email);

            try {
                // If user is already authenticated (e.g., refreshed after step 1),
                // skip signup and go to next step
                const currentUser = useAuthStore.getState().user;
                if (currentUser) {
                    onNext();
                    setIsLoading(false);
                    return;
                }

                await signup({
                    email,
                    password,
                    displayName,
                    username,
                    role: 'creator'
                }, { redirect: false });

                onNext();
            } catch (error: any) {
                console.error("Signup failed", error);
                setError("email", {
                    type: "manual",
                    message: error.message || "Failed to create account"
                });
            }
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                {googleError && (
                    <Alert
                        type="error"
                        message={googleError}
                        onClose={() => setGoogleError(null)}
                    />
                )}
                <h4 className="mb-5 text-h4 dark:text-n-9">Create your account</h4>
                <GoogleButton
                    role="creator"
                    className="btn-stroke w-full h-12 mb-6 rounded-md"
                    onSuccess={(user, isNewUser) => {
                        if (!isNewUser) {
                            router.push('/dashboard');
                            return;
                        }
                        setValue('email', user.email);
                        setValue('displayName', user.displayName);
                        onNext();
                    }}
                    onError={(err) => setGoogleError(err)}
                />

                <div className="flex justify-center items-center pb-6">
                    <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-n-6"></span>
                    <span className="mx-4 text-sm font-medium dark:text-n-6">or</span>
                    <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-n-6"></span>
                </div>

                <AuthFields
                    register={register}
                    errors={errors}
                    touchedFields={touchedFields}
                    dirtyFields={dirtyFields}
                    showName={true}
                    showEmail={true}
                    showPassword={true}
                    className="gap-4 mb-4"
                    emailAutoFocus={true}
                />

                <StepActions
                    onNext={handleNext}
                    isLoading={isLoading}
                />
            </div>

            {/* <div className="mt-20 text-sm dark:text-n-8">
                Not a Creator?

                <Link
                    href="/login"
                    className="ml-1.5 font-bold transition-colors dark:text-n-9"
                >
                    Join as a Member
                </Link>
            </div> */}
        </>
    );
};

export default Step1Account;
