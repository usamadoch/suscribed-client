"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Field from '@/components/Field';
import Loader from '@/components/Loader';
import ChangePriceModal from '@/components/modals/ChangePriceModal';
import { tierSchema, TierFormData } from '../../../schema';
import { useTiers } from '../../../useTiers';
import TierPerks from '../../../new/_components/TierPerks';
import TierPreview from '../../../new/_components/TierPreview';
// import TierPerks from '../../new/_components/TierPerks';
// import TierPreview from '../../new/_components/TierPreview';

const EditTierPage = () => {
    const router = useRouter();
    const params = useParams();
    const tierId = params.id as string;

    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [newPrice, setNewPrice] = useState<number | string>("");

    const { plans, isLoading, updatePlan, isUpdating, updatePlanPrice, isUpdatingPrice } = useTiers();
    const plan = plans.find(p => p._id === tierId);

    const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<TierFormData>({
        resolver: zodResolver(tierSchema),
        defaultValues: {
            name: '',
            price: 5,
            description: '',
            benefits: []
        }
    });

    // Populate form when plan data is available
    useEffect(() => {
        if (plan) {
            reset({
                name: plan.name,
                price: plan.price,
                description: plan.description || '',
                benefits: plan.benefits.map(b => ({ value: b }))
            });
        }
    }, [plan, reset]);

    const formValues = watch();
    const liveBenefits = formValues.benefits?.map(b => b.value.trim()).filter(b => b !== '') || [];

    const onSubmit = (data: TierFormData) => {
        const filteredBenefits = data.benefits
            ?.map(b => b.value.trim())
            .filter(b => b !== '') || [];

        const { price, ...restData } = data;
        const payload = {
            ...restData,
            benefits: filteredBenefits,
        };

        updatePlan({ id: tierId, payload }, {
            onSuccess: () => {
                router.push('/tiers');
            }
        });
    };

    if (isLoading) {
        return <div className="flex justify-center pt-10"><Loader /></div>;
    }

    if (!plan) {
        return (
            <div className="max-w-3xl mx-auto w-full p-8 text-center">
                <h4 className="text-h4 font-bold mb-2">Tier Not Found</h4>
                <p className="text-sm text-n-3 dark:text-n-4 mb-6">The tier you are looking for does not exist.</p>
                <button
                    onClick={() => router.push('/tiers')}
                    className="btn-stroke btn-medium"
                >
                    Back to Tiers
                </button>
            </div>
        );
    }

    return (
        <div className='max-w-3xl mx-auto w-full'>
            <div className="mb-6">
                <h4 className="text-h4 font-bold text-gray-900 dark:text-white">Edit Subscription Tier</h4>
            </div>

            <div className="flex  lg:flex-row gap-8">
                {/* Form Section */}
                <div className="flex-1">
                    <div className="card p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animation-fade-in">
                            <Field
                                label="Tier Name"
                                type="text"
                                classInput='h-12 border-n-4'
                                error={errors.name}
                                {...register('name')}
                            />

                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <Field
                                        label="Monthly Price (PKR)"
                                        type="number"
                                        classInput='h-12 bg-n-2/10 dark:bg-n-2/50 border-n-3/10 cursor-not-allowed opacity-70'
                                        disabled
                                        error={errors.price}
                                        {...register('price', { valueAsNumber: true })}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewPrice(plan ? plan.price : 0);
                                        setIsPriceModalOpen(true);
                                    }}
                                    className="btn-stroke h-12 px-5 mb-0"
                                >
                                    Edit
                                </button>
                            </div>


                            <Field
                                label="Description"
                                classInput='border-n-4'
                                textarea
                                error={errors.description}
                                {...register('description')}
                            />

                            <TierPerks control={control} register={register} />

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/tiers')}
                                    disabled={isUpdating}
                                    className="btn-stroke btn-medium min-w-[120px] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="btn-purple btn-medium min-w-[160px] flex items-center justify-center disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                <TierPreview
                    name={formValues.name || ''}
                    price={formValues.price || 0}
                    description={formValues.description || ''}
                    benefits={liveBenefits}
                />
            </div>

            <ChangePriceModal
                visible={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
                plan={plan}
                newPrice={newPrice}
                setNewPrice={setNewPrice as any}
                isUpdatingPrice={isUpdatingPrice}
                onUpdate={() => {
                    updatePlanPrice({ id: tierId, price: Number(newPrice) }, {
                        onSuccess: () => {
                            setValue('price', Number(newPrice));
                            setIsPriceModalOpen(false);
                        }
                    });
                }}
            />
        </div>
    );
};

export default EditTierPage;
