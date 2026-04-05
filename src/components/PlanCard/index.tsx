import { Tier } from "@/lib/types";
import Icon from "@/components/Icon";
import { ReactNode } from "react";

type PlanCardProps = {
    plan: Tier;
    /** The billing interval selected by the subscriber */
    interval?: 'MONTHLY' | 'YEARLY';
    /** Optional action rendered below the price (e.g. Subscribe button) */
    action?: ReactNode;
    /** Optional action rendered next to the plan name / highlighted label (e.g. Edit button) */
    headerAction?: ReactNode;
    className?: string;
};

const PlanCard = ({ plan, interval = 'MONTHLY', action, headerAction, className = "" }: PlanCardProps) => {
    const displayPrice = interval === 'YEARLY' ? plan.price * 12 : plan.price;
    const periodLabel = interval === 'YEARLY' ? 'year' : 'month';

    return (
        <div className={`relative w-full max-w-80 p ${className}`}>
            {plan.isHighlighted && (
                <div className="absolute top-1.5 left-1.5 w-full h-full bg-white border border-n-1 dark:border-white"></div>
            )}
            <div className={`card relative z-10 px-4 py-6 w-full h-full ${plan.isHighlighted ? 'border-2' : ''}`}>
                <div className="flex flex-col justify-between items-start mb-3">
                    <div className="flex items-center justify-between w-full">
                        <h5 className="text-h5 text-n-1 dark:text-white">{plan.name}</h5>
                        <div className="flex items-center gap-2">
                            {plan.isHighlighted && (
                                <span className="label-purple border border-n-1 dark:border-white capitalize">creator&apos;s pick</span>
                            )}
                            {headerAction}
                        </div>
                    </div>

                    <h4 className="text-h4">
                        PKR {displayPrice}<span className="text-sm font-medium"> /{periodLabel}</span>
                    </h4>
                </div>

                {action}

                <p className="text-sm font-medium py-3">{plan.description}</p>

                {plan.benefits?.length > 0 && (
                    <ul className="space-y-1">
                        {plan.benefits.map((b, i) => (
                            <li key={i} className="text-sm font-medium flex items-center gap-2">
                                <Icon name="check" />
                                {b}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PlanCard;

