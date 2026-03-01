



import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import Field from "@/components/Field";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";

import StepActions from "./StepActions";

import { useAuth, useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { SignUpFormValues } from "@/app/(auth)/_validations";
import { generateUsername } from "@/lib/utils";
import Alert from "@/components/Alert";
import { useAuthTransition } from "@/app/(auth)/_context/AuthTransitionContext";

type Step1Props = {
    onNext: () => void;
};

const Step1Account = ({ onNext }: Step1Props) => {
    const { register, trigger, getValues, setError, setValue, formState: { errors } } = useFormContext<SignUpFormValues>();
    const { signup } = useAuth();
    const router = useRouter();
    const { startTransition, isReversing, completeTransition } = useAuthTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    // If we're reversing (came back from Login), start in a morphed state!
    const [isMorphing, setIsMorphing] = useState(isReversing);

    useEffect(() => {
        if (isReversing) {
            // Trigger the reverse animation next frame so Framer Motion picks it up
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsMorphing(false);
                });
            });
        }
    }, [isReversing]);

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

    const handleMorphToLogin = () => {
        if (isMorphing) return;
        setIsMorphing(true);

        // Phase 1: Morph happens now (fields collapse via isMorphing state)
        // Phase 2+3: After morph completes, tell layout to blur background + slide to center
        setTimeout(() => {
            startTransition();
        }, 1600); // matches field collapse duration

        // Phase 4: Navigate after slide completes
        setTimeout(() => {
            completeTransition();
            router.push('/login?from=register');
        }, 4400); // 1600 morph + 2800 slide
    };

    return (
        <>
            <div>
                {googleError && (
                    <Alert
                        type="error"
                        message={googleError}
                        onClose={() => setGoogleError(null)}
                    />
                )}

                {/* Heading — cross-fades without affecting layout below */}
                <div className="relative mb-5" style={{ minHeight: "3.5rem" }}>
                    <AnimatePresence mode="wait">
                        {!isMorphing ? (
                            <motion.h4
                                key="register-heading"
                                className="text-h4 absolute inset-x-0 top-0"
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 1.0 }}
                            >
                                Create your account
                            </motion.h4>
                        ) : (
                            <motion.div
                                key="login-heading"
                                className="absolute inset-x-0 top-0"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: 0.4 }}
                            >
                                <h4 className="mb-1 text-h4">Sign in or Sign up</h4>
                                <p className="text-sm text-n-2 dark:text-white/50">
                                    Enter your email to continue
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Google button — always visible */}
                <button
                    className="btn-stroke w-full h-12 mb-6"
                    type="button"
                    onClick={() => {
                        setGoogleError(null);
                        handleGoogleLogin();
                    }}
                    disabled={isMorphing}
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

                {/* Full Name field — collapses out during morph */}
                <motion.div
                    animate={{
                        height: isMorphing ? 0 : "auto",
                        opacity: isMorphing ? 0 : 1,
                        marginBottom: isMorphing ? 0 : undefined,
                    }}
                    transition={{
                        duration: 1.6,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ overflow: "hidden" }}
                >
                    <Field
                        className="mb-4"
                        classInput="h-12"
                        placeholder="Full Name"
                        type="text"
                        icon="profile"
                        error={!isMorphing ? errors.displayName : undefined}
                        {...register("displayName")}
                    />
                </motion.div>

                {/* Email field — stays, morphs placeholder */}
                <Field
                    className={isMorphing ? "mb-6" : "mb-4"}
                    classInput="h-12"
                    type="email"
                    placeholder={isMorphing ? "Enter your email" : "Email address"}
                    icon="email"
                    error={!isMorphing ? errors.email : undefined}
                    {...register("email")}
                    autoFocus={!isMorphing}
                    readOnly={isMorphing}
                />

                {/* Password field — collapses out during morph */}
                <motion.div
                    animate={{
                        height: isMorphing ? 0 : "auto",
                        opacity: isMorphing ? 0 : 1,
                        marginBottom: isMorphing ? 0 : undefined,
                    }}
                    transition={{
                        duration: 1.6,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ overflow: "hidden" }}
                >
                    <Field
                        className="mb-4"
                        classInput="h-12"
                        type="password"
                        placeholder="Password"
                        icon="lock"
                        error={!isMorphing ? errors.password : undefined}
                        {...register("password")}
                    />
                </motion.div>

                {/* Button stays visible — just gets disabled during morph */}
                <StepActions
                    onNext={isMorphing ? () => { } : handleNext}
                    isLoading={isLoading || isMorphing}
                />
            </div>

            {/* "Not a Creator?" link — fades out during morph */}
            <motion.div
                className="mt-20 text-sm"
                animate={{
                    opacity: isMorphing ? 0 : 1,
                    height: isMorphing ? 0 : "auto",
                }}
                transition={{ duration: 1.2 }}
                style={{ overflow: "hidden" }}
            >
                Not a Creator?

                <button
                    type="button"
                    onClick={handleMorphToLogin}
                    className="ml-1.5 font-bold transition-colors hover:text-purple-1"
                >
                    Join as a Member
                </button>
            </motion.div>
        </>
    );
};

export default Step1Account;

