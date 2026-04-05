"use client";

import { useFormContext, Controller } from 'react-hook-form';
import Field from '@/components/Field';
import Select from '@/components/Select';
import { PayoutFormData } from '../schema';
import { getIdNumberLabel, idTypeOptions } from '@/lib/utils';

type Props = {
    onPrev: () => void;
    isSubmitting: boolean;
};

const BankDetailsStep = ({ onPrev, isSubmitting }: Props) => {
    const { register, watch, control } = useFormContext<PayoutFormData>();

    const selectedIdType = watch('idType');

    const requiredFields = watch(['bankName', 'accountHolderName', 'iban', 'idType', 'idNumber']);
    const isSubmitDisabled = !requiredFields.every(Boolean) || isSubmitting;

    return (
        <div className="space-y-6 animation-fade-in">
            <Field
                label="Bank Name *"
                type="text"
                classInput='h-12 border-n-4'
                // placeholder="e.g. Chase Bank"
                {...register('bankName')}
            />

            <Field
                label="Account Holder Name *"
                type="text"
                classInput='h-12 border-n-4'
                // placeholder="John Doe"
                {...register('accountHolderName')}
            />

            <Field
                label="IBAN *"
                type="text"
                classInput='h-12 border-n-4'
                // placeholder="IBAN Number"
                {...register('iban')}
            />

            <Controller
                name="idType"
                control={control}
                render={({ field }) => (
                    <Select
                        label="ID Type *"
                        classButton='h-12 border-n-4'
                        classOptions='border-n-4'
                        items={idTypeOptions}
                        value={idTypeOptions.find(opt => opt.id === field.value)}
                        onChange={(val: any) => field.onChange(val.id)}
                    />
                )}
            />

            <Field
                label={getIdNumberLabel(selectedIdType)}
                type="text"
                classInput='h-12 border-n-4'
                // placeholder={getIdNumberPlaceholder(selectedIdType)}
                {...register('idNumber')}
            />

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={isSubmitting}
                    className="btn-stroke btn-medium min-w-[120px] disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="btn-purple btn-medium min-w-[160px] disabled:opacity-50 flex items-center justify-center"
                >

                    Submit for Review
                </button>
            </div>
        </div>
    );
};

export default BankDetailsStep;
