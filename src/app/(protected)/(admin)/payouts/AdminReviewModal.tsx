"use client";

import React, { useState } from 'react';
import { PayoutMethod } from '@/lib/types';

interface ReviewModalProps {
    payout: PayoutMethod;
    onClose: () => void;
    onReview: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
    isReviewing: boolean;
}

const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Spinner = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export function AdminReviewModal({ payout, onClose, onReview, isReviewing }: ReviewModalProps) {
    const [status, setStatus] = useState<'approved' | 'rejected'>('approved');
    const [rejectionReason, setRejectionReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onReview(payout._id, status, status === 'rejected' ? rejectionReason : undefined);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Review Payout Request
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <div className="mb-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700">
                                <span className="block text-gray-500 dark:text-gray-400 mb-1">User/Creator ID</span>
                                <span className="font-medium text-gray-900 dark:text-white break-all">{typeof payout.userId === 'string' ? payout.userId : payout.userId._id}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700">
                                <span className="block text-gray-500 dark:text-gray-400 mb-1">Country</span>
                                <span className="font-medium text-gray-900 dark:text-white">{payout.country || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 space-y-3">
                            <div>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Account Holder</span>
                                <div className="text-gray-900 dark:text-white font-medium">{payout.accountHolderName}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bank Name</span>
                                    <div className="text-gray-900 dark:text-white font-medium">{payout.bankName}</div>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Routing Number</span>
                                    <div className="text-gray-900 dark:text-white font-medium">{payout.routingNumber}</div>
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Account Number</span>
                                <div className="text-gray-900 dark:text-white font-medium font-mono">{payout.accountNumber}</div>
                            </div>
                        </div>

                        {payout.notes && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <span className="block text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Creator Notes</span>
                                <p className="text-sm text-blue-900 dark:text-blue-100">{payout.notes}</p>
                            </div>
                        )}
                    </div>

                    <form id="review-form" onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Review Decision
                            </label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'approved' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="approved"
                                        checked={status === 'approved'}
                                        onChange={() => setStatus('approved')}
                                        className="sr-only"
                                    />
                                    <span className="font-medium">Approve</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'rejected' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="rejected"
                                        checked={status === 'rejected'}
                                        onChange={() => setStatus('rejected')}
                                        className="sr-only"
                                    />
                                    <span className="font-medium">Reject</span>
                                </label>
                            </div>
                        </div>

                        {status === 'rejected' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Rejection Reason *
                                </label>
                                <textarea
                                    required={status === 'rejected'}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-zinc-800 dark:text-white"
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    placeholder="Explain why the bank details cannot be accepted..."
                                />
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isReviewing} className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="review-form"
                        disabled={isReviewing}
                        className={`px-5 py-2 min-w-[120px] font-medium text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 ${status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isReviewing ? <Spinner className="w-4 h-4 animate-spin" /> : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
