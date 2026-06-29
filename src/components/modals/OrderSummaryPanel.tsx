import { Tier, CreatorPage } from '@/types';
import { Radio, RadioGroup } from '@headlessui/react';

interface OrderSummaryPanelProps {
    interval: 'MONTHLY' | 'YEARLY';
    onIntervalChange: (interval: 'MONTHLY' | 'YEARLY') => void;
    plan?: Tier;
    page?: CreatorPage;
    isPending: boolean;
}

const intervalOptions = [
    { id: 'MONTHLY', label: 'Monthly', description: 'Pay month-by-month' },
    { id: 'YEARLY', label: 'Yearly', description: 'Save more with yearly billing' }
];

export default function OrderSummaryPanel({ interval, onIntervalChange, plan, page, isPending }: OrderSummaryPanelProps) {
    return (
        <div className="flex-1 w-full flex flex-col gap-10 items-center px-8 tablet:px-4 mobile:px-0">
            <div className="flex flex-col gap-4 mb-8 w-full">
                <div className="flex flex-col gap-1">
                    <p className="text-h6">Choose how to pay</p>
                    <p className="text-sm">Pay the set price or you can choose to pay more.</p>
                </div>
                <RadioGroup
                    value={intervalOptions.find(i => i.id === interval) || intervalOptions[0]}
                    onChange={(option) => onIntervalChange(option.id as 'MONTHLY' | 'YEARLY')}
                    className="flex flex-col w-full"
                >
                    {intervalOptions.map((opt) => (
                        <Radio
                            key={opt.id}
                            value={opt}
                            className={({ checked }) =>
                                `group border border-n-1 px-4 py-2 dark:border-n-6 relative flex items-start mb-4 last:mb-0 cursor-pointer select-none transition-colors ${checked ? "bg-purple-1 dark:bg-transparent " : "bg-transparent dark:bg-transparent"
                                }`
                            }
                        >
                            {({ checked }) => (
                                <>
                                    <div
                                        className={`flex justify-center items-center w-5 h-5 mt-0.5 mr-3 rounded-full border transition-colors ${checked
                                            ? "border-n-9"
                                            : "bg-transparent border-n-3 dark:border-n-6"
                                            }`}
                                    >
                                        {checked && (
                                            <div className="w-2 h-2 rounded-full bg-n-9" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`text-sm font-bold transition-colors ${checked
                                                ? "text-n-9"
                                                : "text-n-3 dark:text-n-9"
                                                }`}
                                        >
                                            {opt.label}
                                        </div>
                                        <div
                                            className={`text-xs transition-colors ${checked
                                                ? "text-n-8"
                                                : "text-n-3 dark:text-n-8"
                                                }`}
                                        >
                                            {opt.description}
                                        </div>
                                    </div>
                                </>
                            )}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>

            {plan && page && (
                <div className="w-full flex flex-col gap-4">
                    <h5 className="text-h6 font-bold pb-4 border-b border-n-4 dark:border-n-6">Order Summary</h5>

                    <div className="flex items-center gap-4">
                        {page.avatarUrl ? (
                            <img src={page.avatarUrl} alt={page.displayName} className="w-12 h-12 rounded-full object-cover border border-n-1" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-n-3 flex items-center justify-center shrink-0">
                                <span className="text-white font-bold">{page.displayName?.[0]?.toUpperCase()}</span>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-bold text-n-1 dark:text-white">{page.displayName}</p>
                            <div className="flex items-center mt-2 group-hover:scale-105 transition-transform">
                                <span className="inline-block bg-yellow-1 dark:bg-purple-1 border-2 border-n-1 dark:border-n-9 shadow-[3px_3px_0_#151515] dark:shadow-[3px_3px_0_#ffffff] text-n-1 font-black px-2 py-0.5 transform -rotate-2 text-base tracking-widest uppercase">
                                    {plan.name}
                                </span>
                                <span className="ml-3 text-xs font-bold text-n-4 dark:text-n-9 uppercase tracking-wider">Tier</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 py-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-n-3 dark:text-n-9">Monthly Total</span>
                            <div className="text-sm text-n-1 dark:text-white flex items-center">
                                {isPending ? (
                                    <div className="h-5 w-16 bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                ) : (
                                    `PKR ${plan.price.toLocaleString()}`
                                )}
                            </div>
                        </div>

                        {interval === 'YEARLY' && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-n-3 dark:text-n-9">Yearly billing (x12)</span>
                                <div className="text-sm text-n-1 dark:text-white flex items-center">
                                    {isPending ? (
                                        <div className="h-5 w-16 bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                    ) : (
                                        `PKR ${(plan.price * 12).toLocaleString()}`
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-n-1 dark:text-white">Due Total</span>
                            <div className="text-base font-bold text-n-1 dark:text-white flex items-center">
                                {isPending ? (
                                    <div className="h-6 w-24 bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                ) : (
                                    `PKR ${(interval === 'YEARLY' ? plan.price * 12 : plan.price).toLocaleString()}`
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
