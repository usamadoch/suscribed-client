"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tier } from '@/lib/types';
import { useTiers } from '../useTiers';
import Loader from '@/components/Loader';
import PlanCard from '@/components/PlanCard';
import HighlightTierModal from '@/components/modals/HighlightTierModal';
import Icon from '@/components/Icon';







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
                <h4 className="text-h4 font-bold dark:text-n-9">Subscription Tiers</h4>
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
                    <h3 className="text-h5 mb-2 dark:text-n-9">No Subscription Tiers Yet</h3>
                    <p className="text-center text-sm text-n-3 dark:text-n-8 mb-6 max-w-md mx-auto">
                        Create subscription tiers to allow fans to support you on a monthly basis and unlock exclusive content.
                    </p>
                    <button
                        onClick={handleCreate}
                        className="btn-purple btn-medium px-5"
                    >
                        <Icon name="plus" className=" fill-white dark:fill-n-9" />
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

            <HighlightTierModal
                visible={isHighlightModalOpen}
                onClose={() => setIsHighlightModalOpen(false)}
                plans={plans}
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                onSave={handleHighlightSave}
                isUpdating={isUpdating}
            />
        </div>
    );
}
