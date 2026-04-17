import Link from "next/link";

import Modal from "@/components/Modal";
import Field from "@/components/Field";
import Checkbox from "@/components/Checkbox";
import Loader from "@/components/Loader";

import GoogleButton from "@/components/GoogleButton";

import { useAuthForm } from "@/hooks/useAuthForm";

type LoginModalProps = {
    visible: boolean;
    onClose: () => void;
};

const LoginModal = ({ visible, onClose }: LoginModalProps) => {
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const {
        form,
        step, setStep, flow, authLoading, isCheckingEmail,
        onSubmit, resetForm
    } = useAuthForm({
        redirect: false,
        onLoginSuccess: handleClose,
        onSignupSuccess: handleClose,
    });

    const { register, handleSubmit, watch, formState: { errors } } = form;
    const remember = watch("remember");

    return (
        <Modal
            key="login-modal"
            visible={visible}
            onClose={handleClose}
            showCloseIcon={false}
        >

            <div className="px-5 pb-5 pt-18">
                <h6 className="text-h6 pb-5">{step === 1 ? "Sign in / Sign up" : (flow === "login" ? "Sign in" : "Sign up")}</h6>
                {step === 1 && (
                    <>
                        <GoogleButton
                            onSuccess={handleClose}
                            onError={(err) => form.setError("root", { message: err })}
                        />
                        <div className="flex justify-center items-center py-5">
                            <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                            <span className="mx-4 text-sm font-medium">or</span>
                            <span className="w-full max-w-33 h-0.25 bg-n-1 dark:bg-white"></span>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {errors.root && (
                        <div className="mb-4 p-3 bg-pink-1/10 border border-pink-1 rounded text-pink-1 text-sm font-bold">
                            {errors.root.message}
                        </div>
                    )}

                    <Field
                        className={`mb-4.5 ${step === 2 && flow === 'signup' ? 'hidden' : ''}`}
                        // label="Email"
                        type="email"
                        classInput="h-12"
                        placeholder="Enter your email"
                        icon="email"
                        {...register("email")}
                        error={errors.email}
                        required
                        readOnly={step === 2} // Read-only in step 2
                    />

                    {step === 2 && (
                        <>
                            {flow === 'signup' && (
                                <Field
                                    className="mb-5"
                                    // label="Full Name"
                                    type="text"
                                    classInput="h-12"
                                    placeholder="Enter your full name"
                                    icon="profile"
                                    {...register("displayName")}
                                    error={errors.displayName}
                                    required
                                    autoFocus
                                />
                            )}
                            <Field
                                className="mb-5"
                                // label="Password"
                                type="password"
                                classInput="h-12"
                                placeholder="Enter your password"
                                {...register("password")}
                                error={errors.password}
                                required
                                autoFocus={flow === 'login'}
                            />
                        </>
                    )}

                    {step === 2 && flow === 'login' && (
                        <div className="flex justify-between items-center mb-5">
                            <Checkbox
                                label="Remember me"
                                {...register("remember")}
                                checked={remember}
                            />
                            <button
                                className="mt-0.5 text-xs font-bold transition-colors hover:text-purple-1"
                                type="button"
                            >
                                Recover password
                            </button>
                        </div>
                    )}

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
                            className="btn-stroke w-full h-12 mt-5"
                            type="button"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </button>
                    )}
                </form>


                <p className="text-xs text-center mt-28">
                    By signing up, you are creating a Suscribed account and agree to Suscribed's <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
            </div>
        </Modal>
    );
};

export default LoginModal;
