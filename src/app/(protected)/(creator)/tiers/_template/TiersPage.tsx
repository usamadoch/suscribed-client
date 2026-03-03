"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tier } from '@/lib/types';
import { useTiers } from '../useTiers';
import Loader from '@/components/Loader';
import PlanCard from '@/components/PlanCard';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
export default function TiersPage() {
    const { plans, isLoading, updatePlan, isUpdating } = useTiers();
    const router = useRouter();
    const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<{ id: string, title: string } | null>(null);

    const handleEdit = (plan: Tier) => {
        router.push(`/tiers/${plan._id}/edit`);
    };

    const handleCreate = () => {
        router.push('/tiers/new');
    };

    const handleHighlightSave = () => {
        if (!selectedTier) return;
        updatePlan({
            id: selectedTier.id,
            payload: { isHighlighted: true }
        }, {
            onSuccess: () => {
                setIsHighlightModalOpen(false);
                setSelectedTier(null);
            }
        });
    };

    if (isLoading) {
        return <div className="flex justify-center pt-10"><Loader /></div>;
    }

    return (
        <div className="max-w-3xl w-full mx-auto p-4 md:p-8">
            <div className="flex  justify-between items-start md:items-center mb-6 gap-4">
                <h4 className="text-h4 font-bold">Subscription Tiers</h4>
                <div className="flex gap-4">

                    <button
                        onClick={() => setIsHighlightModalOpen(true)}
                        className="btn-stroke btn-medium px-5"
                    >
                        Select Highlighted
                    </button>

                    <button
                        onClick={handleCreate}
                        className="btn-purple btn-medium px-5"
                    >
                        Create Tier
                    </button>
                </div>
            </div>

            {plans.length === 0 ? (
                <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
                    {/* <div className="mx-auto w-16 h-16 bg-purple-3 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-purple-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div> */}
                    <h3 className="text-h5 mb-2">No Subscription Tiers Yet</h3>
                    <p className="text-center text-sm text-n-3 dark:text-n-4 mb-6 max-w-md mx-auto">
                        Create subscription tiers to allow fans to support you on a monthly basis and unlock exclusive content.
                    </p>
                    <button
                        onClick={handleCreate}
                        className="btn-purple px-5"
                    >
                        Create Your First Tier
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <PlanCard
                            className="max-w-full"
                            key={plan._id}
                            plan={plan}
                            headerAction={
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="btn-stroke btn-small shrink-0"
                                >
                                    Edit
                                </button>
                            }
                        />
                    ))}
                </div>
            )}

            <Modal
                visible={isHighlightModalOpen}
                onClose={() => setIsHighlightModalOpen(false)}
                title="Highlight a Tier"
                classOverlay="!bg-n-1/60 dark:!bg-n-1/60"
                classWrap=" border border-n-1"
            >
                <div className="space-y-6">
                    <Select
                        label="Select Highlighted Tier"
                        items={plans.map(p => ({ id: p._id, title: p.name }))}
                        value={selectedTier}
                        onChange={setSelectedTier}
                        classButton='h-12'
                        placeholder="Choose a tier..."
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsHighlightModalOpen(false)}
                            className="btn-stroke btn-medium min-w-[100px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!selectedTier || isUpdating}
                            onClick={handleHighlightSave}
                            className="btn-purple btn-medium min-w-[100px] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
