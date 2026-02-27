"use client";

import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Field from '@/components/Field';
import { PayoutFormData } from '../schema';

type Props = {
    onNext: () => void;
};

const PersonalInfoStep = ({ onNext }: Props) => {
    const router = useRouter();
    const { register, watch } = useFormContext<PayoutFormData>();

    const requiredFields = watch(['firstName', 'lastName', 'dateOfBirth', 'address1', 'city', 'postalCode', 'termsAgreed']);
    const isNextDisabled = !requiredFields.every(Boolean) || requiredFields[6] !== true;

    return (
        <div className="space-y-6 animation-fade-in">
            <div className="grid grid-cols-2 gap-6">
                <Field
                    label="First Name"
                    type="text"
                    classInput='h-12'
                    // placeholder="John"
                    {...register('firstName')}
                />
                <Field
                    label="Last Name"
                    type="text"
                    classInput='h-12'
                    // placeholder="Doe"
                    {...register('lastName')}
                />
            </div>

            <Field
                label="Date of Birth"
                type="date"
                classInput='h-12 dark:[color-scheme:dark]'
                {...register('dateOfBirth')}
            />

            <Field
                label="Address 1"
                type="text"
                classInput='h-12'
                // placeholder="123 Main St"
                {...register('address1')}
            />

            <Field
                label="Address 2"
                type="text"
                classInput='h-12'
                // placeholder="Apt 4B (Optional)"
                {...register('address2')}
            />

            <div className="grid grid-cols-2 gap-6">
                <Field
                    label="City"
                    type="text"
                    classInput='h-12'
                    // placeholder="New York"
                    {...register('city')}
                />
                <Field
                    label="Postal Code"
                    type="text"
                    classInput='h-12'
                    // placeholder="10001"
                    {...register('postalCode')}
                />
            </div>

            <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                    <div className="pt-1">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-purple bg-gray-100 border-gray-300 rounded focus:ring-purple dark:focus:ring-purple dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            {...register('termsAgreed')}
                        />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        I agree to the terms and conditions for processing payouts and authorize the platform to verify my identity.
                    </span>
                </label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    type="button"
                    onClick={() => router.push('/earnings')}
                    className="btn-stroke btn-medium min-w-[120px]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="btn-purple btn-medium min-w-[140px] flex items-center justify-center disabled:opacity-50"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoStep;
