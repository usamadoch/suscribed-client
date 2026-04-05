import { membershipPlanApi } from "@/lib/api";
import { useEffect } from "react";

interface SubscriptionPollerProps {
    trackerToken: string;
    onActivated: () => void;
}

export const SubscriptionPoller = ({
    trackerToken,
    onActivated,
}: SubscriptionPollerProps) => {
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 30; // 60 seconds max

        const poll = async () => {
            attempts++;
            try {
                console.log(`[SubscriptionPoller] Polling status for tracker: ${trackerToken} (attempt ${attempts})`);
                const data = await membershipPlanApi.getSubscriptionStatus(trackerToken);
                
                if (data.status === "active") {
                    console.log("[SubscriptionPoller] Subscription activated!");
                    onActivated();
                } else if (data.status === "failed") {
                    console.error("[SubscriptionPoller] Subscription failed");
                } else if (attempts < maxAttempts) {
                    setTimeout(poll, 2000);
                }
            } catch (err) {
                console.error("[SubscriptionPoller] Polling error:", err);
                if (attempts < maxAttempts) {
                    setTimeout(poll, 2000);
                }
            }
        };

        const timeoutId = setTimeout(poll, 2000); // initial check after 2s
        return () => clearTimeout(timeoutId);
    }, [trackerToken, onActivated]);

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-n-1/5 rounded-lg border border-n-1/10 mt-6">
            <div className="relative w-8 h-8">
                <div className="absolute inset-0 border-2 border-purple-1/20 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-purple-1 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-n-1 dark:text-white">Verifying with your bank…</p>
            <p className="text-xs text-n-3">Please do not close this window.</p>
        </div>
    );
};

export default SubscriptionPoller;
