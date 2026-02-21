



import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";

import Field from "@/components/Field";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";

import StepActions from "./StepActions";

import { useAuth, useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { SignUpFormValues } from "@/app/(auth)/_validations";
import { generateUsername } from "@/lib/utils";
import Link from "next/link";
import Alert from "@/components/Alert";

type Step1Props = {
    onNext: () => void;
};

const Step1Account = ({ onNext }: Step1Props) => {
    const { register, trigger, getValues, setError, setValue, formState: { errors } } = useFormContext<SignUpFormValues>();
    const { signup } = useAuth();
    const router = useRouter(); // Initialize router here
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse: CodeResponse) => {
            setGoogleLoading(true);
            try {
                // Request creator role specifically
                const { user, isNewUser } = await authApi.googleLogin(codeResponse.code, 'creator');

                // Manually update store state
                useAuthStore.setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });

                if (!isNewUser) {
                    // If existing user, go straight to dashboard
                    router.push('/dashboard');
                    return;
                }

                // Pre-fill form data with Google info if available
                setValue('email', user.email);
                setValue('displayName', user.displayName);

                // Go to next step (Creator Details)
                onNext();
            } catch (error: any) {
                setGoogleLoading(false);
                console.error("Google login failed", error);

                // Always use the dedicated Google error state
                setGoogleError(error?.message || "Google login failed");
            }
        },
        onError: () => {
            setGoogleLoading(false);
            setGoogleError("Google login failed");
        }
    });

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
                <h4 className="mb-5 text-h4">Create your account</h4>
                <button
                    className="btn-stroke w-full h-12 mb-6"
                    type="button"
                    onClick={() => {
                        setGoogleError(null);
                        handleGoogleLogin();
                    }}
                >
                    {googleLoading ? (
                        <Loader className="w-6 h-6 text-n-1 dark:text-white" />
                    ) : (
                        <>
                            <Icon name="google" />
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                <div className="flex justify-center items-center pb-6">
                    <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                    <span className="mx-4 text-sm font-medium">or</span>
                    <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                </div>

                <Field
                    className="mb-4"
                    classInput="h-12"
                    // label="Full Name"
                    placeholder="Full Name"
                    type="text"
                    icon="profile"
                    error={errors.displayName}
                    {...register("displayName")}
                />
                <Field
                    className="mb-4"
                    classInput="h-12"
                    // label="Email"
                    type="email"
                    placeholder="Email address"
                    icon="email"
                    error={errors.email}
                    {...register("email")}
                    autoFocus
                />

                <Field
                    className="mb-4"
                    classInput="h-12"
                    // label="Password"
                    type="password"
                    placeholder="Password"
                    icon="lock"
                    error={errors.password}
                    {...register("password")}
                />

                <StepActions
                    onNext={handleNext}
                    isLoading={isLoading}
                />
            </div>

            <div className="mt-20 text-sm">
                Not a Creator?

                <Link
                    href="/login"
                    className="ml-1.5 font-bold transition-colors hover:text-purple-1"
                >
                    Join as a Member
                </Link>
            </div>
        </>
    );
};

export default Step1Account;
