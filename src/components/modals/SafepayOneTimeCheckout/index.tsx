import { useRef, useCallback, useState, useEffect } from 'react';
import '@sfpy/atoms/styles';
import { useSafepayOneTimeCheckout } from '@/hooks/useSafepayOneTimeCheckout';
import { CheckoutView } from './CheckoutView';
import { ChooseMethodView } from './ChooseMethodView';
import { AddNewCardView } from './AddNewCardView';

const SafepayOneTimeCheckout = ({
    trackerToken,
    authToken,
    amount,
    onSuccess,
    onBack,
    streamTitle,
    sessionId,
    messageId,
}: {
    trackerToken: string,
    authToken: string,
    messageId: string,
    sessionId?: string,
    amount: number,
    onSuccess?: (data: any) => void,
    onBack?: () => void,
    streamTitle?: string,
}) => {
    const cardRef = useRef<{
        submit: () => void;
        validate: () => void;
        fetchValidity: () => Promise<boolean>;
        clear: () => void;
    }>(null);

    const [deviceJWT, setDeviceJWT] = useState<string | null>(null);
    const [deviceURL, setDeviceURL] = useState<string | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [saveCard, setSaveCard] = useState(true);
    const [useNewCard, setUseNewCard] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [view, setView] = useState<'checkout' | 'choose_method' | 'add_new_card'>('checkout');
    
    // Create a ref for the current view to ensure mutations only redirect if we haven't navigated away
    const viewRef = useRef(view);
    useEffect(() => {
        viewRef.current = view;
    }, [view]);

    const [selectedCardToken, setSelectedCardToken] = useState<string | null>(null);
    const [setupTrackerData, setSetupTrackerData] = useState<{ trackerToken: string, authToken: string } | null>(null);

    const { walletData, isWalletLoading, refetchWallet, chargeSavedMutation, setupTrackerMutation } = useSafepayOneTimeCheckout({
        sessionId,
        messageId,
        onSuccess,
        setUseNewCard,
        setErrorMessage
    });

    // Override the setupTrackerMutation's mutate to ensure we don't change view if the user navigated away
    const safeSetupTrackerMutation = {
        ...setupTrackerMutation,
        mutate: (variables: any, options?: any) => {
            const currentView = viewRef.current;
            return setupTrackerMutation.mutate(variables, {
                ...options,
                onSuccess: (data: any, vars: any, context: any) => {
                    if (options?.onSuccess) {
                        // Only execute the onSuccess logic (which redirects) if the user is still on the same view
                        // that initiated the mutation, or if we want to force it.
                        if (viewRef.current === currentView) {
                            options.onSuccess(data, vars, context);
                        }
                    }
                }
            });
        }
    };

    const handleFailure = useCallback((error: any) => {
        console.error('Failed:', error);
        setIsProcessing(false);
        setErrorMessage("Payment failed or was cancelled. Please try again.");
    }, []);

    const handleSuccess = useCallback((data: any) => {
        console.log('Payment succeeded:', data);
        if (onSuccess) onSuccess(data);
    }, [onSuccess]);

    const handleSetupSuccess = useCallback(async (data: any) => {
        console.log('Card setup succeeded:', data);
        setIsProcessing(false);
        await refetchWallet();
        setSelectedCardToken(null); // This will default to the newest card
        setUseNewCard(false);
        setView('checkout');
    }, [refetchWallet]);

    const activeCard = selectedCardToken
        ? walletData?.methods?.find((m: any) => m.token === selectedCardToken)
        : walletData?.methods?.[0];

    const handlePayNow = async () => {
        setErrorMessage(null);
        cardRef.current?.validate();

        const isValid = await cardRef.current?.fetchValidity();
        if (!isValid) {
            setErrorMessage("Please check your card details and try again.");
            return;
        }

        setIsProcessing(true);
        try {
            await cardRef.current?.submit();
        } catch (err) {
            setIsProcessing(false);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col overflow-y-auto custom-scrollbar px-1">
                {view === 'choose_method' && (
                    <ChooseMethodView
                        walletData={walletData}
                        activeCard={activeCard}
                        setSelectedCardToken={setSelectedCardToken}
                        setView={setView}
                        setupTrackerMutation={safeSetupTrackerMutation}
                        setErrorMessage={setErrorMessage}
                        setSetupTrackerData={setSetupTrackerData}
                        setDeviceJWT={setDeviceJWT}
                        setDeviceURL={setDeviceURL}
                        setShowAuth={setShowAuth}
                    />
                )}

                {view === 'checkout' && (
                    <CheckoutView
                        amount={amount}
                        streamTitle={streamTitle}
                        walletData={walletData}
                        useNewCard={useNewCard}
                        activeCard={activeCard}
                        errorMessage={errorMessage}
                        setView={setView}
                        setupTrackerMutation={safeSetupTrackerMutation}
                        chargeSavedMutation={chargeSavedMutation}
                        setErrorMessage={setErrorMessage}
                        setSetupTrackerData={setSetupTrackerData}
                        setDeviceJWT={setDeviceJWT}
                        setDeviceURL={setDeviceURL}
                        setShowAuth={setShowAuth}
                        trackerToken={trackerToken}
                        authToken={authToken}
                        saveCard={saveCard}
                        setSaveCard={setSaveCard}
                        cardRef={cardRef}
                        showAuth={showAuth}
                        deviceJWT={deviceJWT}
                        deviceURL={deviceURL}
                        isProcessing={isProcessing}
                        isWalletLoading={isWalletLoading}
                        handleSuccess={handleSuccess}
                        handleFailure={handleFailure}
                        handlePayNow={handlePayNow}
                    />
                )}

                {view === 'add_new_card' && setupTrackerData && (
                    <AddNewCardView
                        setupTrackerData={setupTrackerData}
                        showAuth={showAuth}
                        deviceJWT={deviceJWT}
                        deviceURL={deviceURL}
                        errorMessage={errorMessage}
                        isProcessing={isProcessing}
                        cardRef={cardRef}
                        setView={setView}
                        setDeviceJWT={setDeviceJWT}
                        setDeviceURL={setDeviceURL}
                        setShowAuth={setShowAuth}
                        handleSetupSuccess={handleSetupSuccess}
                        handleFailure={handleFailure}
                        handlePayNow={handlePayNow}
                    />
                )}
            </div>
        </div>
    );
};

export default SafepayOneTimeCheckout;
