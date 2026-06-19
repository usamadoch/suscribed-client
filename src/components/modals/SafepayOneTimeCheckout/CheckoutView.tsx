import { Suspense, RefObject } from 'react';
import { CardCapture, PayerAuthentication, Environment } from '@sfpy/atoms';
import Icon from '../../Icon';
import Loader from '../../Loader';
import Checkbox from '../../Checkbox';

interface CheckoutViewProps {
    amount: number;
    streamTitle?: string;
    walletData: any;
    useNewCard: boolean;
    activeCard: any;
    errorMessage: string | null;
    setView: (view: 'checkout' | 'choose_method' | 'add_new_card') => void;
    setupTrackerMutation: any;
    chargeSavedMutation: any;
    setErrorMessage: (msg: string | null) => void;
    setSetupTrackerData: (data: any) => void;
    setDeviceJWT: (jwt: string | null) => void;
    setDeviceURL: (url: string | null) => void;
    setShowAuth: (show: boolean) => void;
    trackerToken: string;
    authToken: string;
    saveCard: boolean;
    setSaveCard: (val: boolean) => void;
    cardRef: RefObject<{
        submit: () => void;
        validate: () => void;
        fetchValidity: () => Promise<boolean>;
        clear: () => void;
    } | null>;
    showAuth: boolean;
    deviceJWT: string | null;
    deviceURL: string | null;
    isProcessing: boolean;
    isWalletLoading: boolean;
    handleSuccess: (data: any) => void;
    handleFailure: (error: any) => void;
    handlePayNow: () => Promise<void>;
}

export const CheckoutView = ({
    amount,
    streamTitle,
    walletData,
    useNewCard,
    activeCard,
    errorMessage,
    setView,
    setupTrackerMutation,
    chargeSavedMutation,
    setErrorMessage,
    setSetupTrackerData,
    setDeviceJWT,
    setDeviceURL,
    setShowAuth,
    trackerToken,
    authToken,
    saveCard,
    setSaveCard,
    cardRef,
    showAuth,
    deviceJWT,
    deviceURL,
    isProcessing,
    isWalletLoading,
    handleSuccess,
    handleFailure,
    handlePayNow
}: CheckoutViewProps) => {
    return (
        <>
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="text-base font-medium text-n-1 dark:text-n-9">Commons Super Message</div>
                        <div className="text-base font-medium text-n-1 dark:text-n-9">Rs {amount.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-n-8 mt-1">
                        {streamTitle || "Support the stream with a highlighted message."}
                    </div>
                </div>
            </div>

            <div className="flex flex-col mt-8">
                {isWalletLoading && (
                    <div className="flex justify-center items-center py-8">
                        <Loader />
                    </div>
                )}
                {!isWalletLoading && (!walletData?.hasSavedCard || useNewCard) && (
                    <div className="flex flex-col my-4">
                        <div className="text-n-1 dark:text-n-8 mb-2 font-semibold">
                            Add Card details
                        </div>
                        <div
                            style={{
                                height: '48px',
                                border: '1.5px solid #ffffff26',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <div className="relative w-full h-full">
                                <Suspense fallback={<div className="p-3 text-sm text-n-3">Loading card form...</div>}>
                                    <CardCapture
                                        environment={Environment.Sandbox}
                                        authToken={authToken}
                                        tracker={trackerToken}
                                        validationEvent="submit"
                                        imperativeRef={cardRef}
                                        onProceedToAuthentication={(data: any) => {
                                            setDeviceJWT(data.accessToken);
                                            setDeviceURL(data.deviceDataCollectionURL);
                                            setShowAuth(true);
                                        }}
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
                            </div>
                        </div>

                        <div className="w-full mt-4">
                            {showAuth && deviceJWT && deviceURL && (
                                <Suspense fallback={<div>Authenticating...</div>}>
                                    <PayerAuthentication
                                        environment={Environment.Sandbox}
                                        tracker={trackerToken}
                                        authToken={authToken}
                                        deviceDataCollectionJWT={deviceJWT}
                                        deviceDataCollectionURL={deviceURL}
                                        authorizationOptions={{
                                            do_capture: true,
                                            do_card_on_file: saveCard
                                        }}
                                        imperativeRef={cardRef}
                                        onPayerAuthenticationSuccess={handleSuccess}
                                        onPayerAuthenticationFrictionless={handleSuccess}
                                        onPayerAuthenticationFailure={handleFailure}
                                        onPayerAuthenticationUnavailable={handleFailure}
                                        onSafepayError={handleFailure}
                                    />
                                </Suspense>
                            )}
                        </div>

                        <div className="mt-5 mb-2">
                            <Checkbox 
                                label="Save this card for future payments" 
                                checked={saveCard} 
                                onChange={() => setSaveCard(!saveCard)} 
                            />
                        </div>

                        <p className="text-xs text-n-3 dark:text-n-8 my-4">
                            By continuing, you verify that you are at least 18 years old and agree to these terms.
                            Creators can end streams or remove chat messages at any time, without refund. Learn more.
                        </p>

                        <button
                            className="btn btn-stroke w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handlePayNow}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Loader /> : `Pay Rs ${amount.toLocaleString()}`}
                        </button>
                    </div>
                )}

                {!isWalletLoading && walletData?.hasSavedCard && !useNewCard && (
                    <div className="flex flex-col gap-3">
                        <div>
                            <div className="text-n-1 dark:text-n-8 mb-2 font-semibold">
                                Pay with
                            </div>
                            <div className='flex items-center justify-between border border-n-6 py-2.5 px-4 rounded-sm bg-n-5'>
                                <div className="">
                                    <div className="text-sm font-medium dark:text-n-9">
                                        {activeCard?.brand || 'Card'} •••• {activeCard?.last4 || '****'}
                                    </div>
                                    <div className="text-xs text-n-3 dark:text-n-7">Expires 08/28</div>
                                </div>

                                <button
                                    className='text-sm font-semibold text-purple-1 cursor-pointer hover:text-purple-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                    onClick={() => setView('choose_method')}
                                    disabled={chargeSavedMutation.isPending || setupTrackerMutation.isPending}
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-n-3 dark:text-n-8 my-4">
                            By continuing, you verify that you are at least 18 years old and agree to these terms.
                            Creators can end streams or remove chat messages at any time, without refund. Learn more.
                        </p>

                        <button
                            className="btn btn-stroke w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => chargeSavedMutation.mutate(activeCard?.token)}
                            disabled={chargeSavedMutation.isPending || setupTrackerMutation.isPending}
                        >
                            {chargeSavedMutation.isPending ? <Loader /> : 'Pay'}
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <p className="text-red-400 mt-4">{errorMessage}</p>
                )}
            </div>
        </>
    );
};
