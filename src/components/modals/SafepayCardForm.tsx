import { Suspense, useRef, useCallback, useState } from 'react';
import { CardCapture, PayerAuthentication, Environment } from '@sfpy/atoms';
import '@sfpy/atoms/styles';
import Loader from '../Loader';
import { Tier, CreatorPage } from '@/types';
import Link from 'next/link';
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, LockKeyhole } from "@/lib/icons";
import { useMutation } from "@tanstack/react-query";
import { membershipService as membershipPlanApi } from "@/services/membership.service";
import { toast } from "react-hot-toast";
import OrderSummaryPanel from './OrderSummaryPanel';
import { getRenewalDate } from '@/lib/utils';

const SafepayCardForm = ({
    trackerToken,
    authToken,
    onSuccess,
    onBack,
    plan,
    page,
    defaultInterval = 'MONTHLY'
}: {
    trackerToken: string,
    authToken: string,
    onSuccess?: (data: any) => void,
    onBack?: () => void,
    plan?: Tier,
    page?: CreatorPage,
    defaultInterval?: 'MONTHLY' | 'YEARLY'
}) => {
    const [interval, setInterval] = useState<'MONTHLY' | 'YEARLY'>(defaultInterval);
    const [currentTrackerToken, setCurrentTrackerToken] = useState(trackerToken);
    const [currentAuthToken, setCurrentAuthToken] = useState(authToken);


    const cardRef = useRef<{
        submit: () => void;
        validate: () => void;
        fetchValidity: () => Promise<boolean>;
        clear: () => void;
    }>(null);

    const [deviceJWT, setDeviceJWT] = useState(null);
    const [deviceURL, setDeviceURL] = useState(null);


    const [showAuth, setShowAuth] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleSuccess = useCallback((data: any) => {
        console.log('Payment + card save succeeded:', data);
        if (onSuccess) onSuccess(data);
    }, [onSuccess]);

    const handleFailure = useCallback((error: any) => {
        console.error('Failed:', error);
    }, []);

    const updateTrackerMutation = useMutation({
        mutationFn: async (newInterval: 'MONTHLY' | 'YEARLY') => {
            if (!plan) throw new Error("Plan not found");
            return await membershipPlanApi.subscribeToPlan(plan._id, newInterval);
        },
        onSuccess: (data: any) => {
            if (data && data.trackerToken && data.authToken) {
                setCurrentTrackerToken(data.trackerToken);
                setCurrentAuthToken(data.authToken);
                setShowAuth(false);
                setDeviceJWT(null);
                setDeviceURL(null);
            } else if (data && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                toast.error('Could not initiate checkout');
            }
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to update plan interval');
        }
    });

    const handleIntervalChange = (newInterval: 'MONTHLY' | 'YEARLY') => {
        setInterval(newInterval);
        if (plan) {
            updateTrackerMutation.mutate(newInterval);
        }
    };


    // This runs when user clicks Pay Now
    const handlePayNow = async () => {
        setErrorMessage(null);
        // 1. Tell the iframe to highlight any field errors visually
        cardRef.current?.validate();


        // 2. Ask the iframe if all fields are actually valid
        const isValid = await cardRef.current?.fetchValidity();
        if (!isValid) {
            setErrorMessage("Please check your card details and try again.");
            return; // stop here, don't submit
        }


        setIsProcessing(true);
        try {
            await cardRef.current?.submit();
            // After this, onProceedToAuthentication fires — processing stays
            // true until success/failure callbacks resolve it
        } catch (err) {
            setIsProcessing(false);
            setErrorMessage("Something went wrong. Please try again.");
        }

    };


    return (
        <>
            <div>

                {onBack && (
                    <button
                        className="btn-medium btn-stroke btn-square rounded-full bg-white dark:bg-n-1 ml-8 tablet:ml-4 mobile:ml-0"
                        onClick={onBack}
                        title="Back"
                    >
                        <Icon icon={ChevronLeft} strokeWidth={2.5} className="text-n-1 dark:text-n-9" />
                    </button>
                )}


                <div className='flex gap-8 items-start w-full mt-8 mobile:flex-col'>

                    {/* Left side: Selected tier details and interval switch */}
                    <OrderSummaryPanel
                        interval={interval}
                        onIntervalChange={handleIntervalChange}
                        plan={plan}
                        page={page}
                        isPending={updateTrackerMutation.isPending}
                    />

                    {/* Right side: Payment form */}
                    <div className='flex-1 w-full mx-8 tablet:mx-4 mobile:mx-0'>

                        <div className="text-n-1 dark:text-n-9 capitalize mb-1 font-semibold">
                            Add Card details
                        </div>
                        <div
                            className="flex flex-col"
                            style={{
                                height: '48px',
                                border: '1.5px solid #ffffff26',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                // padding: '0 14px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',

                                // marginBottom: '30px',

                            }}
                        >


                            {/* Step 1: Card input — user types their card details */}
                            <div className="relative w-full h-full">
                                {updateTrackerMutation.isPending ? (
                                    <div className="absolute inset-0 z-10 w-full h-full bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded-[10px]"></div>
                                ) : (
                                    <Suspense fallback={<div>Loading card form...</div>}>
                                        <CardCapture
                                            environment={Environment.Sandbox}
                                            authToken={currentAuthToken}
                                            tracker={currentTrackerToken}
                                            validationEvent="submit"
                                            imperativeRef={cardRef}

                                            onReady={() => {
                                                console.log('Card iframe loaded');
                                            }}

                                            onProceedToAuthentication={(data: any) => {
                                                setDeviceJWT(data.accessToken);
                                                setDeviceURL(data.deviceDataCollectionURL);
                                                setShowAuth(true); // now we have everything, mount PayerAuthentication
                                            }}



                                            // Styles rendered INSIDE the iframe
                                            inputStyle={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                fontSize: '14px',
                                                color: '#151515',
                                                backgroundColor: '#f5f6f9',
                                                letterSpacing: '0.02em',
                                            }}

                                        />
                                    </Suspense>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8 mt-2">
                            <div className="flex gap-2 items-center">
                                <img src="/merchant_logos/visa.svg" alt="Visa" className="h-8 w-auto" />
                                <img src="/merchant_logos/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-n-3 dark:text-n-9">
                                <Icon icon={LockKeyhole} size={14} className="text-n-3 dark:text-n-9" />
                                <span>Secured</span>
                            </div>
                        </div>

                        <div className=" mb-4 gap-3 text-n-3 flex flex-col dark:text-n-9">
                            <div className='text-sm font-medium'>
                                {updateTrackerMutation.isPending ? (
                                    <div className="h-5 w-[280px] max-w-full bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                ) : (
                                    `You’ll pay PKR ${plan ? (interval === 'YEARLY' ? plan.price * 12 : plan.price).toLocaleString() : 0} ${interval === 'YEARLY' ? 'yearly' : 'monthly'} starting today.`
                                )}
                            </div>
                            <p className="text-xs">
                                By clicking Subscribe now, you agree to our{" "}
                                <Link href="/terms" className="underline transition-colors ">
                                    Terms of Use
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="underline transition-colors">
                                    Privacy Policy
                                </Link>.
                                This subscription automatically renews, you can cancel anytime.

                            </p>
                        </div>

                        <button
                            className='btn-purple rounded-sm w-full mt-4 font-bold cursor-pointer uppercase tracking-widest flex items-center justify-center'
                            onClick={handlePayNow}
                            disabled={isProcessing || updateTrackerMutation.isPending}
                        >
                            {isProcessing ? <Loader /> : (
                                updateTrackerMutation.isPending ? (
                                    <div className="h-5 w-32 bg-n-1/20 dark:bg-n-3/20 animate-pulse rounded" />
                                ) : (
                                    `Subscribe now`
                                )
                            )}
                        </button>

                        <p className="text-xs text-center text-n-3 dark:text-n-9 mt-3">
                            Renews PKR {plan ? (interval === 'YEARLY' ? plan.price * 12 : plan.price).toLocaleString() : 0} on {getRenewalDate(interval)} · Cancel anytime
                        </p>

                        {/* Show error below the button */}
                        {errorMessage && (
                            <p className="text-red-400 mt-2">{errorMessage}</p>
                        )}

                        <div className='w-full'>

                            {showAuth && deviceJWT && deviceURL && (
                                <Suspense fallback={<div>Authenticating...</div>}>
                                    <PayerAuthentication
                                        environment={Environment.Sandbox}
                                        tracker={currentTrackerToken}
                                        authToken={currentAuthToken}
                                        deviceDataCollectionJWT={deviceJWT}
                                        deviceDataCollectionURL={deviceURL}
                                        authorizationOptions={{
                                            do_capture: true,       // charge immediately
                                            do_card_on_file: true   // save the card for future recurring charges
                                        }}

                                        imperativeRef={cardRef}
                                        onPayerAuthenticationSuccess={handleSuccess}
                                        onPayerAuthenticationFrictionless={handleSuccess} // bank skipped OTP, still success
                                        onPayerAuthenticationFailure={handleFailure}
                                        onPayerAuthenticationUnavailable={handleFailure}
                                        onSafepayError={handleFailure}
                                    />
                                </Suspense>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SafepayCardForm;
