import { useState, useEffect } from "react";
import { Tier } from "@/types";
import Loader from "@/components/Loader";
import PlanCard from "@/components/PlanCard";
import Switch from "@/components/Switch";
import Icon from "@/components/Icon";
import { motion } from "framer-motion";

type PlansSelectionProps = {
    plans: Tier[];
    loadingPlans: boolean;
    interval: 'MONTHLY' | 'YEARLY';
    setInterval: (interval: 'MONTHLY' | 'YEARLY') => void;
    onSubscribe: (planId: string) => void;
    isSubscribing: boolean;
    subscribingPlanId: string | null;
};

const PlansSelection = ({
    plans,
    loadingPlans,
    interval,
    setInterval,
    onSubscribe,
    isSubscribing,
    subscribingPlanId
}: PlansSelectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);

    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1180) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };
        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    const handleNext = () => {
        if (currentIndex < plans.length - itemsToShow) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (currentIndex > Math.max(0, plans.length - itemsToShow)) {
            setCurrentIndex(Math.max(0, plans.length - itemsToShow));
        }
    }, [plans.length, itemsToShow]);

    const isMobile = itemsToShow === 1;
    const showControls = !isMobile && plans.length > itemsToShow;

    return (
        <div className="w-full">
            {plans.length > 0 && (
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
                            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${interval === 'YEARLY' ? 'text-purple-1' : 'text-n-8 '}`}
                            onClick={() => setInterval('YEARLY')}
                        >
                            Annually
                        </span>
                    </div>
                </div>
            )}

            <div className={`relative w-full max-w-6xl mx-auto ${isMobile ? 'px-6' : 'px-12'} pb-20 group`}>
                {loadingPlans ? (
                    <div className="flex justify-center p-4"><Loader /></div>
                ) : plans.length > 0 ? (
                    <div className={isMobile ? "" : "overflow-hidden"}>
                        <motion.div
                            className={`flex ${isMobile ? "flex-wrap justify-center gap-6" : `gap-6 ${plans.length < itemsToShow ? 'justify-center' : ''}`}`}
                            animate={isMobile ? { x: 0 } : { x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (24 / itemsToShow)}px)` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {plans.map((plan: Tier) => (
                                <div
                                    key={plan._id}
                                    className={isMobile ? "w-full flex justify-center" : "shrink-0"}
                                    style={isMobile ? {} : { width: `calc(${100 / itemsToShow}% - ${(24 * (itemsToShow - 1)) / itemsToShow}px)` }}
                                >
                                    <PlanCard
                                        plan={plan}
                                        interval={interval}
                                        className="border border-n-8 rounded-xl dark:border-n-7 max-w-none"
                                        action={
                                            <button
                                                className="btn-purple btn-medium w-full transition-shadow hover:shadow-primary-4"
                                                onClick={() => onSubscribe(plan._id)}
                                                disabled={isSubscribing}
                                            >
                                                {isSubscribing && subscribingPlanId === plan._id ? <Loader /> : <span>Subscribe</span>}
                                            </button>
                                        }
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <p className="text-n-3 dark:text-n-8">This creator hasn&apos;t published any subscription tiers yet.</p>
                    </div>
                )}

                {showControls && (
                    <>
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 btn-stroke btn-medium btn-square bg-n-1 rounded-full `}
                        >
                            <Icon name="arrow-prev" className="fill-inherit" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= plans.length - itemsToShow}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 btn-stroke btn-medium btn-square bg-n-1 rounded-full `}
                        >
                            <Icon name="arrow-next" className="fill-inherit" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlansSelection;
