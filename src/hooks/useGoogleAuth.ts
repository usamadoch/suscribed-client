import { useState } from "react";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import { authService as authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth";

interface UseGoogleAuthOptions {
    onSuccess?: (user: any, isNewUser?: boolean) => void;
    onError?: (error: string) => void;
    role?: 'member' | 'creator';
}

export const useGoogleAuth = ({ onSuccess, onError, role = 'member' }: UseGoogleAuthOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse: CodeResponse) => {
            setIsLoading(true);
            setError(null);
            try {
                const { user, isNewUser } = await authApi.googleLogin(codeResponse.code, role);
                
                // Update auth store
                useAuthStore.setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });

                if (onSuccess) {
                    onSuccess(user, isNewUser);
                }
            } catch (err: any) {
                console.error("Google login failed", err);
                const errorMessage = err?.message || "Google login failed";
                setError(errorMessage);
                if (onError) {
                    onError(errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            const errorMessage = "Google login failed";
            setError(errorMessage);
            setIsLoading(false);
            if (onError) {
                onError(errorMessage);
            }
        }
    });

    return {
        handleGoogleLogin: () => {
            setError(null);
            handleGoogleLogin();
        },
        isLoading,
        error,
        setError
    };
};
