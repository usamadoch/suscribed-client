import { Suspense, useRef, useCallback, useState } from 'react';
import { CardCapture, PayerAuthentication, Environment } from '@sfpy/atoms';
import '@sfpy/atoms/styles';
import Loader from '../Loader';
import { Tier, CreatorPage } from '@/types';
import { Radio, RadioGroup } from '@headlessui/react';
import Icon from '../Icon';
import { useMutation } from "@tanstack/react-query";
import { membershipService as membershipPlanApi } from "@/services/membership.service";
import { toast } from "react-hot-toast";

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

    const intervalOptions = [
        { id: 'MONTHLY', label: 'Monthly', description: 'Pay month-by-month' },
        { id: 'YEARLY', label: 'Yearly', description: 'Save more with yearly billing' }
    ];

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
            <div className="">

                {onBack && (
                    <button
                        className='btn-stroke h-8 font-normal ml-8 text-n-3 dark:text-n-9'
                        onClick={onBack}
                    >
                        <Icon name='arrow-prev' />
                        Back
                    </button>
                )}


                <div className='flex md:flex-row gap-8 items-start w-full mt-8'>

                    {/* Left side: Selected tier details and interval switch */}
                    <div className="flex-1 w-full flex flex-col gap-10 items-center px-8">

                        <div className="flex flex-col gap-4 mb-8 w-full">
                            <div className="flex flex-col gap-1">
                                <p className="text-h6">Choose how to pay</p>
                                <p className="text-sm">Pay the set price or you can choose to pay more.</p>
                            </div>
                            <RadioGroup
                                value={intervalOptions.find(i => i.id === interval) || intervalOptions[0]}
                                onChange={(option) => handleIntervalChange(option.id as 'MONTHLY' | 'YEARLY')}
                                className="flex flex-col w-full"
                            >
                                {intervalOptions.map((opt) => (
                                    <Radio
                                        key={opt.id}
                                        value={opt}
                                        className={({ checked }) =>
                                            `group border border-n-1 px-4 py-2 dark:border-n-6 relative flex items-start mb-4 last:mb-0 cursor-pointer select-none transition-colors ${checked ? "bg-purple-1 dark:bg-transparent " : "bg-transparent dark:bg-transparent"
                                            }`
                                        }
                                    >
                                        {({ checked }) => (
                                            <>
                                                <div
                                                    className={`flex justify-center items-center w-5 h-5 mt-0.5 mr-3 rounded-full border transition-colors ${checked
                                                        ? "border-n-9"
                                                        : "bg-transparent border-n-3 dark:border-n-6"
                                                        }`}
                                                >
                                                    {checked && (
                                                        <div className="w-2 h-2 rounded-full bg-n-9" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className={`text-sm font-bold transition-colors ${checked
                                                            ? "text-n-9"
                                                            : "text-n-3 dark:text-n-9"
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </div>
                                                    <div
                                                        className={`text-xs transition-colors ${checked
                                                            ? "text-n-8"
                                                            : "text-n-3 dark:text-n-8"
                                                            }`}
                                                    >
                                                        {opt.description}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </div>

                        {plan && page && (
                            <div className="w-full flex flex-col gap-4">
                                <h5 className="text-h6 font-bold pb-4 border-b border-n-4 dark:border-n-6">Order Summary</h5>

                                <div className="flex items-center gap-4">
                                    {page.avatarUrl ? (
                                        <img src={page.avatarUrl} alt={page.displayName} className="w-12 h-12 rounded-full object-cover border border-n-1" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-n-3 flex items-center justify-center shrink-0">
                                            <span className="text-white font-bold">{page.displayName?.[0]?.toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-bold text-n-1 dark:text-white">{page.displayName}</p>
                                        <div className="flex items-center mt-2 group-hover:scale-105 transition-transform">
                                            <span className="inline-block bg-yellow-1 dark:bg-purple-1 border-2 border-n-1 dark:border-n-9 shadow-[3px_3px_0_#151515] dark:shadow-[3px_3px_0_#ffffff] text-n-1 font-black px-2 py-0.5 transform -rotate-2 text-base tracking-widest uppercase">
                                                {plan.name}
                                            </span>
                                            <span className="ml-3 text-xs font-bold text-n-4 dark:text-n-9 uppercase tracking-wider">Tier</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 py-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-n-3 dark:text-n-9">Monthly Total</span>
                                        <div className="text-sm text-n-1 dark:text-white flex items-center">
                                            {updateTrackerMutation.isPending ? (
                                                <div className="h-5 w-16 bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                            ) : (
                                                `PKR ${plan.price}`
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-n-1 dark:text-white">Due Total</span>
                                        <div className="text-base font-bold text-n-1 dark:text-white flex items-center">
                                            {updateTrackerMutation.isPending ? (
                                                <div className="h-6 w-24 bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                            ) : (
                                                `PKR ${interval === 'YEARLY' ? plan.price * 12 : plan.price}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side: Payment form */}
                    <div className='flex-1 w-full mx-8'>

                        <div className="text-n-1 dark:text-white capitalize mb-1 font-semibold">
                            Card details
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

                                marginBottom: '30px',

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

                        <div className=" mb-4 text-n-3 flex flex-col gap-1 dark:text-n-9">
                            <div className='text-sm font-medium'>
                                {updateTrackerMutation.isPending ? (
                                    <div className="h-5 w-[280px] max-w-full bg-n-3/20 dark:bg-n-6/50 animate-pulse rounded" />
                                ) : (
                                    `You’ll pay PKR ${plan ? (interval === 'YEARLY' ? plan.price * 12 : plan.price) : 0} ${interval === 'YEARLY' ? 'yearly' : 'monthly'} starting today.`
                                )}
                            </div>
                            <p className='text-xs'>
                                By clicking "Pay Now", you agree to our Terms of Use and Privacy Policy. This subscription automatically renews, and you’ll be notified in advance if the pricing changes. Cancel anytime in your membership settings.
                            </p>
                        </div>

                        <button
                            className='btn-purple btn-medium w-full h-12 mt-4 font-bold cursor-pointer uppercase tracking-widest flex items-center justify-center'
                            onClick={handlePayNow}
                            disabled={isProcessing || updateTrackerMutation.isPending}
                        >
                            {isProcessing ? <Loader /> : (
                                updateTrackerMutation.isPending ? (
                                    <div className="h-5 w-32 bg-n-1/20 dark:bg-n-3/20 animate-pulse rounded" />
                                ) : (
                                    `Pay PKR ${plan ? (interval === 'YEARLY' ? plan.price * 12 : plan.price) : 0}`
                                )
                            )}
                        </button>

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
