import { Radio, RadioGroup } from "@headlessui/react";
import Icon from '../../Icon';
import Loader from '../../Loader';

interface ChooseMethodViewProps {
    walletData: any;
    activeCard: any;
    setSelectedCardToken: (token: string) => void;
    setView: (view: 'checkout' | 'choose_method' | 'add_new_card') => void;
    setupTrackerMutation: any;
    setErrorMessage: (msg: string | null) => void;
    setSetupTrackerData: (data: any) => void;
    setDeviceJWT: (jwt: string | null) => void;
    setDeviceURL: (url: string | null) => void;
    setShowAuth: (show: boolean) => void;
}

export const ChooseMethodView = ({
    walletData,
    activeCard,
    setSelectedCardToken,
    setView,
    setupTrackerMutation,
    setErrorMessage,
    setSetupTrackerData,
    setDeviceJWT,
    setDeviceURL,
    setShowAuth
}: ChooseMethodViewProps) => {
    return (
        <div className="flex flex-col h-full">
            <button
                className="flex items-center w-fit text-xs font-bold mb-6 uppercase cursor-pointer"
                onClick={() => setView('checkout')}
                disabled={setupTrackerMutation.isPending}
            >
                <Icon name="arrow-prev" className="w-4 h-4 mr-1 fill-n-1 dark:fill-n-9" />
                Back to checkout
            </button>

            <div className="flex flex-col gap-3">
                <RadioGroup
                    value={activeCard}
                    onChange={(card: any) => setSelectedCardToken(card.token)}
                    className="flex flex-col gap-3"
                    disabled={setupTrackerMutation.isPending}
                >
                    {walletData?.methods?.map((method: any, index: number) => {
                        return (
                            <Radio
                                key={method.token}
                                value={method}
                                className={({ checked }) =>
                                    `flex items-center justify-between p-4 border cursor-pointer transition-colors ${checked ? 'border-purple-1 bg-purple-1/5' : 'border-n-6 bg-transparent hover:border-n-5'
                                    } ${setupTrackerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`
                                }
                            >
                                {({ checked }) => (
                                    <div className="flex items-center gap-4 w-full">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${checked ? 'border-purple-1' : 'border-n-4'}`}>
                                            {checked && <div className="w-2.5 h-2.5 rounded-full bg-purple-1" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-n-1 dark:text-n-9">
                                                    {method.brand || 'Card'} •••• {method.last4 || '****'}
                                                </span>
                                                {index === 0 && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-1/20 text-green-1">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-n-3 dark:text-n-7">Expires 08/28</span>
                                        </div>
                                    </div>
                                )}
                            </Radio>
                        );
                    })}
                </RadioGroup>

                <button
                    className="btn btn-stroke border border-dashed flex items-center justify-center gap-2 w-full mt-1"
                    onClick={() => {
                        setErrorMessage(null);
                        setupTrackerMutation.mutate(undefined, {
                            onSuccess: (data: any) => {
                                setSetupTrackerData(data);
                                setDeviceJWT(null);
                                setDeviceURL(null);
                                setShowAuth(false);
                                setView('add_new_card');
                            },
                            onError: (err: any) => {
                                setErrorMessage("Failed to initiate card setup. Please try again.");
                            }
                        });
                    }}
                    disabled={setupTrackerMutation.isPending}
                >
                    {setupTrackerMutation.isPending ? <Loader /> : (
                        <>
                            <Icon name="plus" className="w-5 h-5 fill-n-1 dark:fill-n-9" />
                            Pay with a new card instead
                        </>
                    )}
                </button>
            </div>

            <div className="mt-8">
                <button
                    className="btn btn-stroke w-full h-12"
                    onClick={() => setView('checkout')}
                    disabled={setupTrackerMutation.isPending}
                >
                    Use this card
                </button>
            </div>
        </div>
    );
};
