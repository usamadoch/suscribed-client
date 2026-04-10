
import { fetchApi } from "./api.client";
import { PayoutMethod } from "@/types";

export const payoutService = {
    async getMyPayoutMethod(): Promise<PayoutMethod | null> {
        return fetchApi('/payouts/me');
    },

    async submitPayoutMethod(payload: Partial<PayoutMethod>): Promise<PayoutMethod> {
        return fetchApi('/payouts', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getEarningsSummary(): Promise<{
        availableBalance: number;
        pendingBalance: number;
        lifetimeEarnings: number;
    }> {
        return fetchApi('/payouts/summary');
    }
};

export const adminService = {
    async getPendingPayouts(): Promise<{ payouts: PayoutMethod[] }> {
        return fetchApi('/admin/payouts/pending');
    },

    async reviewPayout(id: string, payload: { status: 'approved' | 'rejected', rejectionReason?: string }): Promise<PayoutMethod> {
        return fetchApi(`/admin/payouts/${id}/review`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },
};
