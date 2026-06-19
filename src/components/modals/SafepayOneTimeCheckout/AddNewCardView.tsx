import { Suspense, RefObject } from 'react';
import { CardCapture, PayerAuthentication, Environment } from '@sfpy/atoms';
import Icon from '../../Icon';
import Loader from '../../Loader';

interface AddNewCardViewProps {
    setupTrackerData: { trackerToken: string, authToken: string } | null;
    showAuth: boolean;
    deviceJWT: string | null;
    deviceURL: string | null;
    errorMessage: string | null;
    isProcessing: boolean;
    cardRef: RefObject<{
        submit: () => void;
        validate: () => void;
        fetchValidity: () => Promise<boolean>;
        clear: () => void;
    } | null>;
    setView: (view: 'checkout' | 'choose_method' | 'add_new_card') => void;
    setDeviceJWT: (jwt: string | null) => void;
    setDeviceURL: (url: string | null) => void;
    setShowAuth: (show: boolean) => void;
    handleSetupSuccess: (data: any) => Promise<void>;
    handleFailure: (error: any) => void;
    handlePayNow: () => Promise<void>;
}

export const AddNewCardView = ({
    setupTrackerData,
    showAuth,
    deviceJWT,
    deviceURL,
    errorMessage,
    isProcessing,
    cardRef,
    setView,
    setDeviceJWT,
    setDeviceURL,
    setShowAuth,
    handleSetupSuccess,
    handleFailure,
    handlePayNow
}: AddNewCardViewProps) => {
    if (!setupTrackerData) return null;

    return (
        <div className="flex flex-col h-full mt-2">
            <button
                className="flex items-center w-fit text-xs font-bold mb-6 uppercase cursor-pointer"
                onClick={() => setView('choose_method')}
                disabled={isProcessing}
            >
                <Icon name="arrow-prev" className="w-4 h-4 mr-1 fill-n-1 dark:fill-n-9" />
                Back to choose method
            </button>

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
                            authToken={setupTrackerData.authToken}
                            tracker={setupTrackerData.trackerToken}
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
            <p className='text-xs text-n-3 dark:text-n-8 mt-1 flex items-center'>
                🔒<span className='ml-1'>Encrypted and securely processed</span>
            </p>

            <div className="w-full mt-4">
                {showAuth && deviceJWT && deviceURL && (
                    <Suspense fallback={<div>Authenticating...</div>}>
                        <PayerAuthentication
                            environment={Environment.Sandbox}
                            tracker={setupTrackerData.trackerToken}
                            authToken={setupTrackerData.authToken}
                            deviceDataCollectionJWT={deviceJWT}
                            deviceDataCollectionURL={deviceURL}
                            authorizationOptions={{
                                do_capture: false, // Don't charge, just tokenize/save
                                do_card_on_file: true
                            }}
                            imperativeRef={cardRef}
                            onPayerAuthenticationSuccess={handleSetupSuccess}
                            onPayerAuthenticationFrictionless={handleSetupSuccess}
                            onPayerAuthenticationFailure={handleFailure}
                            onPayerAuthenticationUnavailable={handleFailure}
                            onSafepayError={handleFailure}
                        />
                    </Suspense>
                )}
            </div>

            {errorMessage && (
                <p className="text-red-400 mt-4">{errorMessage}</p>
            )}

            <div className="mt-8">
                <button
                    className="btn btn-stroke w-full h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePayNow}
                    disabled={isProcessing}
                >
                    {isProcessing ? <Loader /> : `Save Card`}
                </button>
            </div>
        </div>
    );
};
