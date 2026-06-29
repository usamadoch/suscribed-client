"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/Image";
import LoginModal from "@/components/modals/LoginModal";
import JoinTierModal from "@/components/modals/JoinTierModal";
import { useAuth } from "@/store/auth";
import { useCreatorPlans } from "@/hooks/queries";
import { CreatorPage } from "@/types";

type StickyJoinBarProps = {
    page: CreatorPage;
    isOwner: boolean;
    isMember: boolean;
    onJoinSuccess?: () => void;
};

const StickyJoinBar = ({ page, isOwner, isMember, onJoinSuccess }: StickyJoinBarProps) => {
    const { isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const isPreview = searchParams.get("preview") === "true";
    
    // Determine if the bar should be completely hidden
    const shouldHide = (isOwner || isMember) && !isPreview;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const creatorId = typeof page.userId === "object" ? page.userId?._id : page.userId;
    const { data: plans = [] } = useCreatorPlans(creatorId || "");

    const minPrice = plans && plans.length > 0
        ? Math.min(...plans.map((p: any) => p.price))
        : null;

    // Persist modal open state on refresh if it was triggered here
    useEffect(() => {
        if (shouldHide) return;

        const wasOpen = sessionStorage.getItem(`join_modal_open_${page.pageSlug}`);
        if (wasOpen === "true" && isAuthenticated) {
            setIsJoinModalOpen(true);
        }
    }, [page.pageSlug, isAuthenticated, shouldHide]);

    // Handle scroll visibility
    useEffect(() => {
        if (shouldHide || isPreview) return; // No need to listen to scroll if hiding or always showing in preview

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150);
        };

        window.addEventListener("scroll", handleScroll);
        // Run initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [shouldHide, isPreview]);

    if (shouldHide) return null;

    const isVisible = isPreview || isScrolled;

    const handleOpenJoinModal = () => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsJoinModalOpen(true);
        sessionStorage.setItem(`join_modal_open_${page.pageSlug}`, "true");
    };

    const handleCloseJoinModal = () => {
        setIsJoinModalOpen(false);
        sessionStorage.removeItem(`join_modal_open_${page.pageSlug}`);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, x: "-50%", opacity: 0 }}
                        animate={{ y: 0, x: "-50%", opacity: 1 }}
                        exit={{ y: 100, x: "-50%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 25 }}
                        className="fixed bottom-6 left-1/2 z-40 flex items-center justify-between gap-6 px-6 py-3.5 rounded-full bg-white/90 dark:bg-n-1/90 backdrop-blur-md  shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-[calc(100%-2rem)] max-w-3xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    className="object-cover rounded-full"
                                    family="avatar"
                                    slot="profile"
                                    src={page.avatarUrl}
                                    fill
                                    alt="Avatar"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-bold text-n-1 dark:text-n-9 leading-tight">
                                    Join {page.displayName}'s community and enjoy exclusive member benefits.
                                </span>
                                <span className="text-sm font-bold text-n-3 dark:text-n-9 mt-0.5">
                                    {minPrice !== null ? `Starting at PKR ${minPrice.toLocaleString()}/mo` : "Enjoy exclusive member benefits."}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenJoinModal}
                            className="btn-purple px-6 h-10 rounded-full "
                        >
                            Become a Member
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            <JoinTierModal
                visible={isJoinModalOpen}
                onClose={handleCloseJoinModal}
                page={page}
                onSubscriptionSuccess={onJoinSuccess}
            />
        </>
    );
};

export default StickyJoinBar;
