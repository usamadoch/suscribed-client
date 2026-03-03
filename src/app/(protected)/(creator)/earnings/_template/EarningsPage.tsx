"use client";

import { useRouter } from 'next/navigation';

import { useEarningsSummary, usePayoutMethod } from '../usePayout';
import Loader from '@/components/Loader';
import { useHeader } from '@/context/HeaderContext';


export default function EarningsPage() {
    useHeader({ title: "Earnings" });
    const router = useRouter();

    const { payoutMethod, isLoading: isPayoutLoading } = usePayoutMethod();
    const { data: summary, isLoading: isSummaryLoading } = useEarningsSummary();

    const isLoading = isPayoutLoading || isSummaryLoading;

    if (isLoading) {
        return <div className='flex justify-center items-center pt-10'><Loader /></div>
    }

    const renderBanner = () => {
        return (
            <div className="bg-[#daf464] border border-n-1 px-5 py-4 mb-6 shadow-primary-4 ">
                <div className='flex flex-col items-start gap-2 justify-between'>


                    <h5 className="text-h5 font-bold ">Setup Payout Method</h5>
                    <p className="text-sm">Add your bank details to receive payments from your fans.</p>

                    <button
                        onClick={() => router.push('/earnings/setup-bank')}
                        className="btn-stroke bg-white btn-medium px-12 disabled:opacity-50 disabled:cursor-not-allowed capitalize"
                        disabled={!!payoutMethod}
                    >
                        {payoutMethod ? payoutMethod.status.replace('_', ' ') : 'Setup Now'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='max-w-5xl mx-auto w-full '>

            {renderBanner()}


            <div className='card'>
                <div className="flex lg:block dark:border-white">
                    {/* Available Balance Box */}
                    <div className="flex-1 px-5 py-4 border-r border-n-1 last:border-none lg:border-r-0 lg:border-b dark:border-white">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-n-3 dark:text-white/75">
                                Available Balance
                            </div>
                        </div>
                        <div className="mb-1 text-h5">${((summary?.availableBalance || 0) / 100).toFixed(2)}</div>
                    </div>

                    {/* Pending Balance Box */}
                    <div className="flex-1 px-5 py-4 border-r border-n-1 last:border-none lg:border-r-0 lg:border-b dark:border-white">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-n-3 dark:text-white/75">
                                Pending Balance
                            </div>
                        </div>
                        <div className="mb-1 text-h5">${((summary?.pendingBalance || 0) / 100).toFixed(2)}</div>
                    </div>

                    {/* Lifetime Earnings Box */}
                    <div className="flex-1 px-5 py-4 border-r border-n-1 last:border-none lg:border-r-0 lg:border-b dark:border-white">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-n-3 dark:text-white/75">
                                Lifetime Earnings
                            </div>
                        </div>
                        <div className="mb-1 text-h5">${((summary?.lifetimeEarnings || 0) / 100).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
