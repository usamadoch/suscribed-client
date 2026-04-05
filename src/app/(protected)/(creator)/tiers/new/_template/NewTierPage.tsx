"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Field from '@/components/Field';
import { tierSchema, TierFormData } from '../../schema';
import { useTiers } from '../../useTiers';
import TierPerks from '../_components/TierPerks';
import TierPreview from '../_components/TierPreview';

const NewTierPage = () => {
    const router = useRouter();
    const { createPlan, isCreating } = useTiers();

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<TierFormData>({
        resolver: zodResolver(tierSchema),
        defaultValues: {
            name: '',
            price: 250,
            description: '',
            benefits: []
        }
    });

    const formValues = watch();
    const liveBenefits = formValues.benefits?.map(b => b.value.trim()).filter(b => b !== '') || [];

    const onSubmit = (data: TierFormData) => {
        const filteredBenefits = data.benefits
            ?.map(b => b.value.trim())
            .filter(b => b !== '') || [];

        const payload = {
            ...data,
            price: data.price,
            benefits: filteredBenefits,
            status: 'published' as const
        };

        createPlan(payload, {
            onSuccess: () => {
                router.push('/tiers');
            }
        });
    };

    return (
        <div className='max-w-3xl mx-auto w-full'>
            <div className="mb-6">
                <h4 className="text-h4 font-bold text-gray-900 dark:text-white">Create Subscription Tier</h4>
            </div>

            <div className="flex  lg:flex-row gap-8">
                {/* Form Section */}
                <div className="flex-1">
                    <div className="card p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animation-fade-in">
                            <Field
                                label="Tier Name"
                                type="text"
                                classInput='h-12'
                                error={errors.name}
                                {...register('name')}
                            />

                            <Field
                                label="Monthly Price (PKR)"
                                type="number"
                                classInput='h-12'
                                error={errors.price}
                                {...register('price', { valueAsNumber: true })}
                            />


                            <Field
                                label="Description"
                                textarea
                                error={errors.description}
                                {...register('description')}
                            />

                            <TierPerks control={control} register={register} />

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/tiers')}
                                    disabled={isCreating}
                                    className="btn-stroke btn-medium min-w-[120px] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="btn-purple btn-medium min-w-[160px] flex items-center justify-center disabled:opacity-50"
                                >
                                    Save Tier
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
        </div>
    );
};

export default NewTierPage;