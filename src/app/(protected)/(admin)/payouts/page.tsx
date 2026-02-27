"use client";

import React, { useState } from 'react';
import { useAdminPayouts } from './useAdminPayouts';
import { AdminReviewModal } from './AdminReviewModal';
import { PayoutMethod } from '@/lib/types';
import { formatAppDate } from '@/lib/date';

const Spinner = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function AdminPayoutsPage() {
    const { payouts, isLoading, reviewPayout, isReviewing } = useAdminPayouts();
    const [selectedPayout, setSelectedPayout] = useState<PayoutMethod | null>(null);

    const handleReview = (id: string, status: 'approved' | 'rejected', reason?: string) => {
        reviewPayout({ id, status, rejectionReason: reason }, {
            onSuccess: () => setSelectedPayout(null)
        });
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Spinner className="animate-spin text-gray-500 w-8 h-8" /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Payout Approvals</h1>

            {payouts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-gray-500 dark:text-gray-400">There are no pending payout method requests to review.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs uppercase font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4">Account Holder</th>
                                    <th className="px-6 py-4">Bank</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {payouts.map(payout => (
                                    <tr key={payout._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatAppDate(payout.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {payout.accountHolderName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payout.bankName}
                                            {payout.country && <span className="ml-2 text-xs text-gray-500">({payout.country})</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedPayout(payout)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                            >
                                                Review Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedPayout && (
                <AdminReviewModal
                    payout={selectedPayout}
                    onClose={() => setSelectedPayout(null)}
                    onReview={handleReview}
                    isReviewing={isReviewing}
                />
            )}
        </div>
    );
}
