import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { liveApi } from "@/services/live.service";
import { SuperChatTier } from "@/types";

export const useSuperChatTiers = () => {
    const { data: tiersData, isLoading: isTiersLoading } = useQuery({
        queryKey: ['superchat-tiers'],
        queryFn: async () => {
            const tiers = await liveApi.getSuperChatTiers();
            return tiers || [];
        }
    });

    const getTier = useCallback((amount: number) => {
        if (!tiersData || tiersData.length === 0) {
            return { bg: '#1E88E5', textareaBg: 'transparent', maxLength: 0, pinTime: null, canMessage: false, textDark: false, pinTimeMinutes: 0 };
        }
        const tier = tiersData.find((t: SuperChatTier) => amount >= t.minAmount);
        if (tier) {
            return {
                bg: tier.bgColor,
                textareaBg: tier.textareaBg,
                maxLength: tier.maxLength,
                pinTime: tier.pinTimeLabel,
                canMessage: tier.canMessage,
                textDark: tier.textDark,
                pinTimeMinutes: tier.pinTimeMinutes
            };
        }
        return { bg: '#1E88E5', textareaBg: 'transparent', maxLength: 0, pinTime: null, canMessage: false, textDark: false, pinTimeMinutes: 0 };
    }, [tiersData]);

    return { tiersData, getTier, isTiersLoading };
};

export const useSuperChatAPI = (sessionId?: string) => {
    const { tiersData, getTier, isTiersLoading } = useSuperChatTiers();

    const { data: sessionData } = useQuery({
        queryKey: ['publicLiveSession', sessionId],
        queryFn: async () => {
            if (!sessionId) return null;
            return await liveApi.getPublicSession(sessionId);
        },
        enabled: !!sessionId,
    });

    const initiateMutation = useMutation({
        mutationFn: async (data: { amount: number; message: string }) => {
            if (!sessionId) throw new Error("No session ID");
            return await liveApi.initiatePaidMessage(sessionId, { amount: data.amount, message: data.message });
        }
    });

    const confirmMutation = useMutation({
        mutationFn: async (trackerToken: string) => {
            if (!sessionId) throw new Error("No session ID");
            return await liveApi.confirmPaidMessage(sessionId, trackerToken);
        }
    });

    return {
        tiersData,
        getTier,
        isTiersLoading,
        sessionData,
        initiateMutation,
        confirmMutation
    };
};
