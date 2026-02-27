"use client";

import React, { useState } from 'react';
import { useTiers } from './useTiers';
import { PlanModal } from './PlanModal';
import { Tier } from '@/lib/types';

const Spinner = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default function TiersPage() {
    const { plans, isLoading } = useTiers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Tier | null>(null);

    const handleEdit = (plan: Tier) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Spinner className="animate-spin text-gray-500 w-8 h-8" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Tiers</h1>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    + Create Tier
                </button>
            </div>

            {plans.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Subscription Tiers Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Create subscription tiers to allow fans to support you on a monthly basis and unlock exclusive content.
                    </p>
                    <button
                        onClick={handleCreate}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Create Your First Tier
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan._id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col relative">
                            {plan.status === 'draft' && (
                                <div className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-3 py-1 uppercase tracking-wider text-center">
                                    Draft
                                </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                {plan.badgeTitle && (
                                    <span className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded-md mb-3 self-start">
                                        {plan.badgeTitle}
                                    </span>
                                )}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">${(plan.price / 100).toFixed(2)}</span>
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">/mo</span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1">
                                    {plan.description}
                                </p>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Benefits</h4>
                                    <ul className="space-y-2">
                                        {plan.benefits.map((benefit, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                        {plan.benefits.length === 0 && (
                                            <li className="text-sm text-gray-500 italic">No specific benefits listed.</li>
                                        )}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="w-full py-2 px-4 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Edit Tier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <PlanModal
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingPlan}
                />
            )}
        </div>
    );
}
