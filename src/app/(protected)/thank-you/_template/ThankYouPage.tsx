"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { membershipPlanApi } from "@/lib/api";
import Loader from "@/components/Loader";
import Link from "next/link";
import Icon from "@/components/Icon";

const ThankYouPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const rawTierId = searchParams.get("tier");
    const rawTracker = searchParams.get("tracker");

    // Process tierId and tracker, handling cases where Safepay incorrectly appends parameters
    let tierId = rawTierId;
    let tracker = rawTracker;

    if (rawTierId && rawTierId.includes('?')) {
        const parts = rawTierId.split('?');
        tierId = parts[0];
        if (!tracker) {
            const extraParams = new URLSearchParams(parts[1]);
            tracker = extraParams.get('tracker');
        }
    }
    const isSuccess = searchParams.get("subscription") === "success";

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const called = useRef(false);

    useEffect(() => {
        if (!tierId || !isSuccess) {
            setStatus("error");
            setErrorMsg("Invalid subscription data.");
            return;
        }

        if (called.current) return;
        called.current = true;

        let isMounted = true;
        let authPollCount = 0;
        const maxPolls = 15; // 45 seconds (3s intervals)

        const checkSubStatus = async () => {
            if (!isMounted) return;

            try {
                const sub: any = await membershipPlanApi.confirmSubscription(tierId!, tracker || undefined);

                if (sub.status === 'active') {
                    setStatus("success");
                } else if (sub.status === 'incomplete') {
                    authPollCount++;
                    if (authPollCount >= maxPolls) {
                        setStatus("error");
                        setErrorMsg("Payment processing took too long. Please refresh or contact support.");
                    } else {
                        setTimeout(checkSubStatus, 3000);
                    }
                } else {
                    setStatus("error");
                    setErrorMsg("Your payment failed. Please try again.");
                }
            } catch (err: any) {
                if (err.code === 'ALREADY_SUBSCRIBED') {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setErrorMsg(err.message || "Failed to confirm subscription.");
                }
            }
        };

        checkSubStatus();

        return () => {
            isMounted = false;
        };
    }, [tierId, isSuccess]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader />
                <p className="mt-4 text-n-3">Confirming your subscription...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 rounded-full bg-n-1 flex items-center justify-center mb-6">
                    <Icon name="close" className="fill-white" />
                </div>
                <h1 className="h2 mb-4">Something went wrong</h1>
                <p className="body-2 text-n-3 mb-8">{errorMsg}</p>
                <Link href="/dashboard" className="btn-purple">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-primary-1/20 flex items-center justify-center mb-6">
                <Icon name="check" className="fill-primary-1 w-10 h-10" />
            </div>
            <h1 className="h2 mb-4">Thank You!</h1>
            <p className="body-2 text-n-3 mb-8">
                Your subscription was successful. You now have access to all the perks of this tier.
            </p>
            <Link href="/dashboard" className="btn-purple btn-medium">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default ThankYouPage;














