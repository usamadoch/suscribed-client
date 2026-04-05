
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { CreatorPage, Tier } from "@/lib/types";
import { useCreatorPlans } from "@/hooks/useQueries";
import { useMutation } from "@tanstack/react-query";
import { membershipPlanApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import { AnimatePresence, motion } from "framer-motion";
import PlanCard from "@/components/PlanCard";
import Switch from "@/components/Switch";


type JoinTierModalProps = {
    visible: boolean;
    onClose: () => void;
    page: CreatorPage;
    onJoin: () => void;
    isJoining: boolean;
};


const JoinTierModal = ({
    visible,
    onClose,
    page,
    onJoin,
    isJoining
}: JoinTierModalProps) => {

    useEffect(() => {
        if (visible) {
            document.documentElement.classList.add('overflow-hidden');
            document.body.classList.add('overflow-hidden');
        } else {
            document.documentElement.classList.remove('overflow-hidden');
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.documentElement.classList.remove('overflow-hidden');
            document.body.classList.remove('overflow-hidden');
        };
    }, [visible]);


    const creatorId = typeof page.userId === 'object' ? page.userId._id : page.userId;
    const { data: plans = [], isLoading: loadingPlans } = useCreatorPlans(creatorId || "");

    const [interval, setInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

    const subscribeMutation = useMutation({
        mutationFn: async (planId: string) => {
            return await membershipPlanApi.subscribeToPlan(planId, interval);
        },
        onSuccess: (data: any) => {
            if (data && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                toast.error('Could not initiate checkout');
            }
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to subscribe');
        }
    });


    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-n-1/72"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Panel – slides from bottom to top */}
                    <motion.div
                        className="relative z-10 w-full max-w-full mx-8 mt-8 h-screen overflow-y-auto bg-background border border-n-1 dark:bg-n-1"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {/* Close button */}
                        <button
                            className="absolute z-2 fill-white bg-n-1/50 w-8 h-8 flex items-center justify-center rounded-full top-4 right-4 hover:fill-purple-1 outline-none dark:fill-white dark:hover:fill-purple-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <Icon className="fill-inherit transition-colors" name="close" />

                        </button>

                        <div className="pt-18">
                            <h4 className="text-h4 text-center py-10">Choose your membership</h4>

                            <div className="flex justify-center mb-10">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${interval === 'MONTHLY' ? 'text-purple-1' : 'text-n-1 hover:text-n-1 dark:hover:text-white'}`}
                                        onClick={() => setInterval('MONTHLY')}
                                    >
                                        Monthly
                                    </span>
                                    <Switch
                                        value={interval === 'YEARLY'}
                                        setValue={() => setInterval(interval === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
                                    />
                                    <span
                                        className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${interval === 'YEARLY' ? 'text-purple-1' : 'text-n-1 hover:text-n-1 dark:hover:text-white'}`}
                                        onClick={() => setInterval('YEARLY')}
                                    >
                                        Yearly
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="flex justify-center gap-6 w-full max-w-6xl px-6 flex-wrap pb-20">
                                    {loadingPlans ? (
                                        <div className="flex justify-center p-4"><Loader /></div>
                                    ) : plans.length > 0 ? (
                                        plans.map((plan: Tier) => (
                                            <PlanCard
                                                key={plan._id}
                                                plan={plan}
                                                interval={interval}
                                                action={
                                                    <button
                                                        className="btn-purple btn-medium w-full transition-shadow hover:shadow-primary-4"
                                                        onClick={() => subscribeMutation.mutate(plan._id)}
                                                        disabled={subscribeMutation.isPending}
                                                    >
                                                        {subscribeMutation.isPending && subscribeMutation.variables === plan._id ? <Loader /> : <span>Subscribe</span>}
                                                    </button>
                                                }
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center p-4">
                                            <p className="text-n-3 mb-4">This creator hasn&apos;t published any subscription tiers yet.</p>
                                            <button
                                                className="btn-stroke btn-medium w-full"
                                                onClick={onJoin}
                                                disabled={isJoining}
                                            >
                                                {isJoining ? <Loader /> : <span>Follow for free instead</span>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JoinTierModal;
