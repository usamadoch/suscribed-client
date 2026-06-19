import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { liveApi } from '@/services/live.service';

interface UseSafepayOneTimeCheckoutProps {
    sessionId?: string;
    messageId: string;
    onSuccess?: (data: any) => void;
    setUseNewCard: (val: boolean) => void;
    setErrorMessage: (msg: string | null) => void;
}

export const useSafepayOneTimeCheckout = ({
    sessionId,
    messageId,
    onSuccess,
    setUseNewCard,
    setErrorMessage
}: UseSafepayOneTimeCheckoutProps) => {
    const { data: walletData, isLoading: isWalletLoading, refetch: refetchWallet } = useQuery({
        queryKey: ['safepay-wallet-status'],
        queryFn: async () => {
            return await liveApi.getWalletStatus();
        }
    });

    const setupTrackerMutation = useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error("Missing session ID");
            return await liveApi.setupTracker(sessionId);
        }
    });

    const chargeSavedMutation = useMutation({
        mutationFn: async (paymentMethodToken?: string) => {
            if (!sessionId || !messageId) throw new Error("Missing session or message ID");
            return await liveApi.chargeSavedCard(sessionId, messageId, paymentMethodToken);
        },
        onSuccess: () => {
            if (onSuccess) onSuccess({ isSavedCardCharge: true });
        },
        onError: (err: any) => {
            if (err.code === 'CHARGE_FAILED') {
                toast.error(err.message || 'Payment failed — please try a different card');
                setUseNewCard(true);
            } else {
                setErrorMessage(err.message || "Payment failed or was cancelled. Please try again.");
            }
        }
    });

    return { walletData, isWalletLoading, refetchWallet, chargeSavedMutation, setupTrackerMutation };
};
