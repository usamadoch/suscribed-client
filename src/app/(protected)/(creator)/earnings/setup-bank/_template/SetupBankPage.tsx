"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePayoutMethod } from '../../usePayout';
import Loader from '@/components/Loader';
import { toast } from 'react-hot-toast';
import Alert from '@/components/Alert';

import { payoutSchema, PayoutFormData } from '../schema';
import PersonalInfoStep from '../_components/PersonalInfoStep';
import BankDetailsStep from '../_components/BankDetailsStep';

const SetupBankPage = () => {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const { payoutMethod, submitMethod, isSubmitting, isLoading } = usePayoutMethod();

    const methods = useForm<PayoutFormData>({
        resolver: zodResolver(payoutSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            address1: '',
            address2: '',
            city: '',
            postalCode: '',
            termsAgreed: false,
            bankName: '',
            accountHolderName: '',
            iban: '',
            idType: 'id_card',
            idNumber: ''
        },
        mode: "onChange"
    });

    useEffect(() => {
        if (payoutMethod) {
            methods.reset({
                firstName: payoutMethod.firstName || '',
                lastName: payoutMethod.lastName || '',
                dateOfBirth: payoutMethod.dateOfBirth
                    ? new Date(payoutMethod.dateOfBirth).toISOString().split('T')[0]
                    : '',
                address1: payoutMethod.address1 || '',
                address2: payoutMethod.address2 || '',
                city: payoutMethod.city || '',
                postalCode: payoutMethod.postalCode || '',
                termsAgreed: true,
                bankName: payoutMethod.bankName || '',
                accountHolderName: payoutMethod.accountHolderName || '',
                iban: payoutMethod.iban || '',
                idType: payoutMethod.idType || 'id_card',
                idNumber: payoutMethod.idNumber || '',
            });
        }
    }, [payoutMethod, methods]);

    const isUpdating = !!payoutMethod && payoutMethod.status === 'approved';

    const handleNextStep = () => {
        setStep(2);
    };

    const handlePrevStep = () => {
        setStep(1);
    };

    const onSubmit = async (data: PayoutFormData) => {
        submitMethod(data, {
            onSuccess: () => {
                toast.custom((t) => (
                    <Alert
                        className="mb-0"
                        type="success"
                        message={payoutMethod ? "Bank details updated successfully" : "Bank details added successfully"}
                        onClose={() => toast.dismiss(t.id)}
                    />
                ), { position: "bottom-right" });
                router.push('/earnings');
            }
        });
    };

    if (isLoading) {
        return <div className='flex justify-center items-center pt-10'><Loader /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="card p-6 md:p-8">
                <h4 className="text-h4 font-bold mb-6">
                    {payoutMethod ? 'Update Bank Details' : 'Add Bank Details'}
                </h4>

                {isUpdating && (
                    <Alert type="warning" className="mb-6">
                        <strong>Warning:</strong> Updating your bank details will pause your active payouts <br />
                        until the new details are re-approved by an admin.
                    </Alert>
                )}


                <FormProvider {...methods}>
                    <form id="payout-form" onSubmit={methods.handleSubmit(onSubmit)}>
                        {step === 1 ? (
                            <PersonalInfoStep onNext={handleNextStep} />
                        ) : (
                            <BankDetailsStep onPrev={handlePrevStep} isSubmitting={isSubmitting} />
                        )}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default SetupBankPage;