


"use client"

import { useRouter } from "next/navigation";

import Icon from "@/components/Icon";
import Loader from "@/components/Loader";

import Alert from "@/components/Alert";
import AuthFields from "../../_components/AuthFields";
import { ONBOARDING_STEPS } from "@/lib/types";

import { useAuthForm } from "@/hooks/useAuthForm";

const LoginPage = () => {
    const router = useRouter();

    const {
        form,
        step, setStep, flow, authLoading, isCheckingEmail, googleLoading,
        onSubmit, handleGoogleLogin
    } = useAuthForm({
        redirect: true,
        onSignupSuccess: () => router.push('/dashboard'),
        onGoogleSuccess: (user) => {
            if (user?.role === 'creator') {
                if ((user?.onboardingStep ?? 0) < ONBOARDING_STEPS.COMPLETE) {
                    router.push('/register');
                } else {
                    router.push('/dashboard');
                }
            } else {
                router.push('/explore');
            }
        }
    });

    const { register, handleSubmit, watch, formState: { errors } } = form;
    const remember = watch("remember");

    return (
        <>


            {step === 1 && (
                <>
                    <button
                        className="btn-stroke w-full h-12"
                        type="button"
                        onClick={() => handleGoogleLogin()}
                        disabled={googleLoading}
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
                    <div className="flex justify-center items-center py-6">
                        <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                        <span className="mx-4 text-sm font-medium">or</span>
                        <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                    </div>
                </>
            )}


            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {errors.root && (
                    <Alert
                        type="error"
                        message={errors.root.message}
                    />
                )}

                <AuthFields
                    register={register}
                    errors={errors}
                    showName={step === 2 && flow === 'signup'}
                    showEmail={!(step === 2 && flow === 'signup')}
                    showPassword={step === 2}
                    emailReadOnly={step === 2}
                    nameAutoFocus={true}
                    passwordAutoFocus={flow === 'login'}
                />

                {/* {step === 2 && flow === 'login' && (
                    <div className="flex justify-between items-center mb-6">
                        <Checkbox
                            label="Remember me"
                            {...register("remember")}
                            checked={remember}
                        />
                        <button
                            className="mt-0.5 text-xs font-bold transition-colors hover:text-purple-1"
                            // onClick={onRecover}
                            type="button"
                        >
                            Recover password
                        </button>
                    </div>
                )} */}

                <button
                    className="btn-purple btn-shadow w-full h-12"
                    type="submit"
                    disabled={authLoading || isCheckingEmail}
                >
                    {authLoading || isCheckingEmail ? (
                        <Loader className="w-6 h-6 text-white" />
                    ) : (
                        step === 1
                            ? "Continue"
                            : (flow === 'login' ? "Sign in" : "Create account")
                    )}
                </button>

                {step === 2 && (
                    <button
                        className="btn-stroke w-full h-12 mt-4"
                        type="button"
                        onClick={() => setStep(1)}
                    >
                        Back
                    </button>
                )}


            </form>
        </>
    );
};

export default LoginPage;
