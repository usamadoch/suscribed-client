
import { Tier } from "@/types";
import Loader from "@/components/Loader";
import PlanCard from "@/components/PlanCard";
import Switch from "@/components/Switch";

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
                                    onClick={() => onSubscribe(plan._id)}
                                    disabled={isSubscribing}
                                >
                                    {isSubscribing && subscribingPlanId === plan._id ? <Loader /> : <span>Subscribe</span>}
                                </button>
                            }
                        />
                    ))
                ) : (
                    <div className="text-center p-4">
                        <p className="text-n-3 dark:text-n-8">This creator hasn&apos;t published any subscription tiers yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlansSelection;
