"use client";

import React, { useState } from 'react';
import { Tier } from '@/lib/types';
import { useTiers } from './useTiers';

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

const TrashIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

interface Props {
    onClose: () => void;
    initialData?: Tier | null;
}

export function PlanModal({ onClose, initialData }: Props) {
    const { createPlan, updatePlan, isCreating, isUpdating } = useTiers();
    const isSubmitting = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price ? initialData.price / 100 : 5, // Convert cents to dollars
        description: initialData?.description || '',
        status: initialData?.status || 'published',
        badgeTitle: initialData?.badgeTitle || ''
    });

    const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || ['']);

    const handleAddBenefit = () => setBenefits([...benefits, '']);
    const handleRemoveBenefit = (index: number) => {
        const newB = [...benefits];
        newB.splice(index, 1);
        setBenefits(newB.length ? newB : ['']);
    };
    const handleBenefitChange = (index: number, val: string) => {
        const newB = [...benefits];
        newB[index] = val;
        setBenefits(newB);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Filter empty benefits
        const filteredBenefits = benefits.filter(b => b.trim() !== '');

        const payload = {
            ...formData,
            price: Math.round(formData.price * 100), // Convert dollars to cents
            benefits: filteredBenefits,
            status: formData.status as 'draft' | 'published'
        };

        if (initialData) {
            updatePlan({ id: initialData._id, payload }, { onSuccess: onClose });
        } else {
            createPlan(payload, { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Tier' : 'Create Subscription Tier'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="plan-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tier Name *
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                placeholder="e.g. VIP Member"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price (USD) *
                                </label>
                                <input
                                    required
                                    type="number"
                                    min={1}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Badge Title (Optional)
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                placeholder="e.g. Early Adopter"
                                value={formData.badgeTitle}
                                onChange={e => setFormData({ ...formData, badgeTitle: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Benefits
                            </label>
                            <div className="space-y-2">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                                            placeholder="What they get..."
                                            value={benefit}
                                            onChange={(e) => handleBenefitChange(i, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBenefit(i)}
                                            className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddBenefit}
                                className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-700"
                            >
                                + Add another benefit
                            </button>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 flex justify-end gap-3 dark:bg-zinc-800/50">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="plan-form" disabled={isSubmitting} className="px-5 py-2 min-w-[120px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70">
                        {isSubmitting ? <Spinner className="w-4 h-4 animate-spin" /> : 'Save Tier'}
                    </button>
                </div>
            </div>
        </div>
    );
}
