
"use client";

import { useEffect, useState, Fragment, useCallback } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { CreatorPage, Tier } from "@/types";
import { useCreatorPlans } from "@/hooks/queries";
import { membershipService as membershipPlanApi } from "@/services/membership.service";
import { useAuth } from "@/store/auth";
import Icon from "@/components/Icon";

import SafepayCardForm from "../SafepayCardForm";
import PlansSelection from "./PlansSelection";
import SubscriptionSuccess from "./SubscriptionSuccess";

type JoinTierModalProps = {
    visible: boolean;
    onClose: () => void;
    page: CreatorPage;
    onSubscriptionSuccess?: () => void;
};

const JoinTierModal = ({
    visible,
    onClose,
    page,
    onSubscriptionSuccess
}: JoinTierModalProps) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams<{ "page-slug": string }>();
    const slug = params["page-slug"] || page.pageSlug;
    

    const [interval, setInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [showSuccess, setShowSuccess] = useState(false);
    const [pageTierId, setPageTierId] = useState<string | null>(null);
    const [safepayData, setSafepayData] = useState<{
        trackerToken: string;
        authToken: string;
    } | null>(null);

    // Persistence Key
    const storageKey = `join_modal_state_${page.pageSlug}`;

    // Load state from sessionStorage on mount
    useEffect(() => {
        const savedState = sessionStorage.getItem(storageKey);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.interval) setInterval(state.interval);
                if (state.showSuccess) setShowSuccess(state.showSuccess);
                if (state.pageTierId) setPageTierId(state.pageTierId);
                if (state.safepayData) setSafepayData(state.safepayData);
            } catch (e) {
                console.error('Failed to restore modal state:', e);
            }
        }
    }, [storageKey]);

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        if (visible) {
            const state = { interval, showSuccess, pageTierId, safepayData };
            sessionStorage.setItem(storageKey, JSON.stringify(state));
        }
    }, [visible, interval, showSuccess, pageTierId, safepayData, storageKey]);

    const creatorId = typeof page.userId === 'object' ? page.userId._id : page.userId;
    const { data: plans = [], isLoading: loadingPlans } = useCreatorPlans(creatorId || "");

    useEffect(() => {
        const classes = ['overflow-hidden'];
        if (visible) {
            document.documentElement.classList.add(...classes);
            document.body.classList.add(...classes);
        } else {
            document.documentElement.classList.remove(...classes);
            document.body.classList.remove(...classes);
        }
        return () => {
            document.documentElement.classList.remove(...classes);
            document.body.classList.remove(...classes);
        };
    }, [visible]);

    const handleManualClose = useCallback(() => {
        setSafepayData(null);
        setPageTierId(null);
        setShowSuccess(false);
        sessionStorage.removeItem(storageKey);
        onClose();
    }, [onClose, storageKey]);

    const handlePaymentSuccess = useCallback(() => {
        // Optimistically update the membership state in the cache
        // Use the slug from params to ensure it matches the query key used in useCreatorPage
        queryClient.setQueryData(['creator-page', slug, user?._id], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                isMember: true,
                page: { 
                    ...old.page, 
                    memberCount: (old.page.memberCount || 0) + 1 
                }
            };
        });

        // Force invalidate all related queries to unlock content
        queryClient.invalidateQueries({ queryKey: ['creator-posts', slug], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ['creator-page', slug], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ['recent-videos', slug], refetchType: 'all' });

        if (onSubscriptionSuccess) onSubscriptionSuccess();
        setShowSuccess(true);
    }, [slug, queryClient, user?._id, onSubscriptionSuccess]);

    const subscribeMutation = useMutation({
        mutationFn: async (planId: string) => {
            setPageTierId(planId);
            return await membershipPlanApi.subscribeToPlan(planId, interval);
        },
        onSuccess: (data: any) => {
            if (data?.trackerToken && data?.authToken) {
                setSafepayData({ trackerToken: data.trackerToken, authToken: data.authToken });
            } else if (data?.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                toast.error('Could not initiate checkout');
            }
        },
        onError: (err: any) => toast.error(err.message || 'Failed to subscribe')
    });

    const currentStep = showSuccess ? 'success' : safepayData ? 'checkout' : 'plans';

    return (
        <Transition show={visible} as={Fragment}>
            <Dialog onClose={() => {}} className="relative z-9999">
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
                            <button
                                className="absolute z-2 fill-white bg-n-1/50 w-8 h-8 flex items-center justify-center rounded-full top-4 right-4 hover:fill-purple-1 outline-none dark:fill-white dark:hover:fill-purple-1"
                                onClick={handleManualClose}
                            >
                                <Icon className="fill-inherit transition-colors" name="close" />
                            </button>

                            <div className="pt-18 overflow-hidden relative">
                                {!showSuccess && <h4 className="text-h4 text-center py-10">Choose your membership</h4>}

                                <AnimatePresence mode="popLayout" initial={false}>
                                    {currentStep === 'success' ? (
                                        <motion.div 
                                            key="success" 
                                            initial={{ x: "100%", opacity: 0 }} 
                                            animate={{ x: 0, opacity: 1 }} 
                                            exit={{ x: "-100%", opacity: 0 }}
                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                        >
                                            <SubscriptionSuccess
                                                page={page}
                                                plan={plans.find((p: Tier) => p._id === pageTierId)}
                                                onViewContent={() => { 
                                                    handleManualClose();
                                                    router.push(`/${slug}`);
                                                    router.refresh();
                                                }}
                                                onBackToHome={() => { handleManualClose(); router.push('/'); }}
                                            />
                                        </motion.div>
                                    ) : currentStep === 'checkout' && safepayData ? (
                                        <motion.div 
                                            key="checkout" 
                                            initial={{ x: "100%", opacity: 0 }} 
                                            animate={{ x: 0, opacity: 1 }} 
                                            exit={{ x: "-100%", opacity: 0 }} 
                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                            className="w-full max-w-6xl mx-auto p-6 pt-0"
                                        >
                                            <SafepayCardForm
                                                trackerToken={safepayData.trackerToken}
                                                authToken={safepayData.authToken}
                                                plan={plans.find((p: Tier) => p._id === pageTierId)}
                                                page={page}
                                                defaultInterval={interval}
                                                onSuccess={handlePaymentSuccess}
                                                onBack={() => { setSafepayData(null); setPageTierId(null); }}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="plans" 
                                            initial={{ x: "-100%", opacity: 0 }} 
                                            animate={{ x: 0, opacity: 1 }} 
                                            exit={{ x: "-100%", opacity: 0 }}
                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                        >
                                            <PlansSelection
                                                plans={plans}
                                                loadingPlans={loadingPlans}
                                                interval={interval}
                                                setInterval={setInterval}
                                                onSubscribe={(id) => subscribeMutation.mutate(id)}
                                                isSubscribing={subscribeMutation.isPending}
                                                subscribingPlanId={subscribeMutation.variables as string}
                                            />
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
