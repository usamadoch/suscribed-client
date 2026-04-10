
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { CreatorPage, Tier } from "@/types";
import { useCreatorPlans } from "@/hooks/queries";
import { useMutation } from "@tanstack/react-query";
import { membershipService as membershipPlanApi } from "@/services/membership.service";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import PlanCard from "@/components/PlanCard";
import Switch from "@/components/Switch";
import SafepayCardForm from "./SafepayCardForm";
import { motion, AnimatePresence } from "framer-motion";


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

    const [safepayData, setSafepayData] = useState<{
        trackerToken: string,
        authToken: string,
    } | null>(null);
    const [pageTierId, setPageTierId] = useState<string | null>(null);

    const handleBack = () => {
        setSafepayData(null);
        setPageTierId(null);
    };


    const subscribeMutation = useMutation({
        mutationFn: async (planId: string) => {
            setPageTierId(planId);
            return await membershipPlanApi.subscribeToPlan(planId, interval);
        },
        onSuccess: (data: any) => {
            console.log("data on client:", data);
            if (data && data.trackerToken && data.authToken) {
                setSafepayData({
                    trackerToken: data.trackerToken,
                    authToken: data.authToken,
                    // deviceJWT: data.deviceJWT || "",
                    // deviceURL: data.deviceURL || ""
                });
            } else if (data && data.checkoutUrl) {
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
        <Transition show={visible} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-9999">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-n-1/72" aria-hidden="true" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
                    <TransitionChild
                        as={Fragment}
                        enter="transform transition ease-out duration-400"
                        enterFrom="translate-y-full"
                        enterTo="translate-y-0"
                        leave="transform transition ease-in duration-400"
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
                    >
                        <DialogPanel className="relative z-10 w-full max-w-full mx-8 mt-8 h-screen overflow-y-auto bg-background border border-n-1 dark:bg-n-4">
                            {/* Close button */}
                            <button
                                className="absolute z-2 fill-white bg-n-1/50 w-8 h-8 flex items-center justify-center rounded-full top-4 right-4 hover:fill-purple-1 outline-none dark:fill-white dark:hover:fill-purple-1"
                                onClick={onClose}
                            >
                                <Icon className="fill-inherit transition-colors" name="close" />
                            </button>

                            <div className="pt-18 overflow-hidden relative">
                                <h4 className="text-h4 text-center py-10">Choose your membership</h4>

                                <AnimatePresence mode="popLayout" initial={false}>
                                    {safepayData ? (
                                        <motion.div
                                            key="safepay-form"
                                            initial={{ x: "100%", opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: "100%", opacity: 0 }}
                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                            className="w-full max-w-6xl mx-auto p-6 pt-0"
                                        >
                                            <SafepayCardForm
                                                trackerToken={safepayData.trackerToken}
                                                authToken={safepayData.authToken}
                                                plan={plans.find((p: Tier) => p._id === pageTierId)}
                                                page={page}
                                                defaultInterval={interval}
                                                onSuccess={() => {
                                                    window.location.href = `/thank-you?subscription=success&tier=${pageTierId}`;
                                                }}
                                                onBack={handleBack}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="plans-list"
                                            initial={{ x: "-100%", opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: "-100%", opacity: 0 }}
                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                            className="w-full"
                                        >
                                            {plans.length > 0 && (
                                                <div className="flex justify-center mb-10">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${interval === 'MONTHLY' ? 'text-purple-1' : 'text-n-1 hover:text-n-1 dark:hover:text-white'}`}
                                                            onClick={() => setInterval('MONTHLY')}
                                                        >

                                                        </span>
                                                        <Switch
                                                            value={interval === 'YEARLY'}
                                                            setValue={() => setInterval(interval === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
                                                        />
                                                        <span
                                                            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${interval === 'YEARLY' ? 'text-purple-1' : 'text-n-8 '}`}
                                                            onClick={() => setInterval('YEARLY')}
                                                        >
                                                            Annually
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-center gap-6 w-full max-w-6xl mx-auto px-6 flex-wrap pb-20">
                                                {loadingPlans ? (
                                                    <div className="flex justify-center p-4"><Loader /></div>
                                                ) : plans.length > 0 ? (
                                                    plans.map((plan: Tier) => (
                                                        <PlanCard
                                                            key={plan._id}
                                                            plan={plan}
                                                            interval={interval}
                                                            className="border border-n-8 rounded-xl dark:border-n-7"
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
                                                        <p className="text-n-3 dark:text-n-8">This creator hasn&apos;t published any subscription tiers yet.</p>
                                                        {/* <button
                                                            className="btn-stroke btn-medium w-full"
                                                            onClick={onJoin}
                                                            disabled={isJoining}
                                                        >
                                                            {isJoining ? <Loader /> : <span>Follow for free instead</span>}
                                                        </button> */}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default JoinTierModal;
