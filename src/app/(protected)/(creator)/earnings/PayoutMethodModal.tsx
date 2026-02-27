"use client";

import React, { useState } from 'react';
import { PayoutMethod } from '@/lib/types';
import { usePayoutMethod } from './usePayout';

const Spinner = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface Props {
    onClose: () => void;
    initialData?: PayoutMethod | null;
}

export function PayoutMethodModal({ onClose, initialData }: Props) {
    const { submitMethod, isSubmitting } = usePayoutMethod();
    const [formData, setFormData] = useState({
        accountHolderName: initialData?.accountHolderName || '',
        bankName: initialData?.bankName || '',
        accountNumber: initialData?.accountNumber || '',
        routingNumber: initialData?.routingNumber || '',
        country: initialData?.country || '',
        notes: initialData?.notes || ''
    });

    const isUpdating = !!initialData && initialData.status === 'approved';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitMethod(formData, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Update Bank Details' : 'Add Bank Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {isUpdating && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-sm">
                            <strong className="font-medium text-yellow-900 dark:text-yellow-400">Warning:</strong> Updating your bank details will pause your active payouts until the new details are re-approved by an admin.
                        </div>
                    )}

                    <form id="payout-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Account Holder Name *
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                value={formData.accountHolderName}
                                onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bank Name *
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                placeholder="e.g. Chase Bank"
                                value={formData.bankName}
                                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Account Number *
                                </label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                    value={formData.accountNumber}
                                    placeholder={initialData && '••••' + initialData.accountNumber.slice(-4) || ''}
                                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Routing/SWIFT *
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                    value={formData.routingNumber}
                                    onChange={e => setFormData({ ...formData, routingNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Country Code (Optional)
                            </label>
                            <input
                                type="text"
                                maxLength={2}
                                placeholder="US"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white uppercase"
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Additional Notes
                            </label>
                            <textarea
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                value={formData.notes || ''}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any context administrators should know..."
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 flex justify-end gap-3 dark:bg-zinc-800/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="payout-form"
                        disabled={isSubmitting}
                        className="px-5 py-2 min-w-[120px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isSubmitting ? <Spinner className="w-4 h-4 animate-spin" /> : 'Submit for Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}

