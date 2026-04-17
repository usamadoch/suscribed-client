import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiClientError } from "@/services/api.client";
import { authService as authApi } from "@/services/auth.service";
import { LoginSchema } from "@/app/(auth)/_validations";
import { useAuth } from "@/store/auth";

export const SignupSchema = LoginSchema.extend({
    displayName: z.string().min(1, "Full name is required"),
});

export type AuthFormData = z.infer<typeof SignupSchema>;

type UseAuthFormOptions = {
    redirect?: boolean;
    onLoginSuccess?: () => void;
    onSignupSuccess?: () => void;
};

export const useAuthForm = ({ redirect = true, onLoginSuccess, onSignupSuccess }: UseAuthFormOptions = {}) => {
    const { login, signup, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState<1 | 2>(1);
    const [flow, setFlow] = useState<'login' | 'signup'>('login');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const form = useForm<AuthFormData>({
        resolver: zodResolver(step === 1 ? LoginSchema.pick({ email: true }) : (flow === 'login' ? LoginSchema : SignupSchema)) as any,
        defaultValues: {
            email: "",
            password: "",
            displayName: "",
            remember: false,
        },
        mode: "onChange"
    });

    const { trigger, getValues, setError, reset } = form;

    const handleEmailCheck = async () => {
        setIsCheckingEmail(true);
        const valid = await trigger("email");
        if (!valid) {
            setIsCheckingEmail(false);
            return;
        }

        const email = getValues("email");
        try {
            const { exists } = await authApi.checkEmail(email);
            setFlow(exists ? 'login' : 'signup');
            setStep(2);
        } catch (error) {
            console.error("Email check failed", error);
            setError("root", { message: "Failed to verify email. Please try again." });
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (step === 1) {
            await handleEmailCheck();
            return;
        }

        try {
            if (flow === 'login') {
                await login(data, { redirect });
                onLoginSuccess?.();
            } else {
                const base = data.displayName.toLowerCase().replace(/[^a-z0-9]/g, '') || data.email.split('@')[0];
                const username = `user${base}${Math.floor(Math.random() * 1000)}`;

                await signup({
                    email: data.email,
                    password: data.password,
                    displayName: data.displayName,
                    username,
                    role: 'member'
                }, { redirect });
                onSignupSuccess?.();
            }
        } catch (error) {
            if (error instanceof ApiClientError) {
                if (error.details) {
                    Object.keys(error.details).forEach((key) => {
                        setError(key as any, {
                            type: "manual",
                            message: error.details![key][0],
                        });
                    });
                } else {
                    setError("root", {
                        type: "manual",
                        message: error.message,
                    });
                }
            } else {
                setError("root", { message: "An unexpected error occurred." });
            }
        }
    };

    const resetForm = () => {
        setStep(1);
        setFlow('login');
        reset();
    };

    return {
        form,
        step,
        setStep,
        flow,
        setFlow,
        authLoading,
        isCheckingEmail,
        onSubmit,
        resetForm
    };
};
