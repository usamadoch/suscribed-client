import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

interface GoogleButtonProps {
    onSuccess?: (user: any, isNewUser?: boolean) => void;
    onError?: (error: string) => void;
    className?: string;
    text?: string;
    role?: 'member' | 'creator';
}

const GoogleButton = ({
    onSuccess,
    onError,
    className = "btn-stroke w-full h-12 rounded-md",
    text = "Continue with Google",
    role = 'member'
}: GoogleButtonProps) => {
    const { handleGoogleLogin, isLoading } = useGoogleAuth({
        onSuccess,
        onError,
        role
    });

    return (
        <button
            className={className}
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader className="w-6 h-6 text-n-1 dark:text-n-9" />
            ) : (
                <>
                    <Icon name="google" />
                    <span>{text}</span>
                </>
            )}
        </button>
    );
};

export default GoogleButton;
