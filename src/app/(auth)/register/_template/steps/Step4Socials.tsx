



import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

import StepActions from "./StepActions";

import Icon from "@/components/Icon";

import { useAuthStore } from "@/store/auth";
import { authService as authApi } from "@/services/auth.service";

import { ONBOARDING_STEPS } from "@/types";

type Step4Props = {
    onBack: () => void;
};

const Step4Socials = ({ onBack }: Step4Props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    // "idle" | "authorizing" | "selecting" | "connecting" | "connected"
    const [youtubeStatus, setYoutubeStatus] = useState<string>("idle");
    const [availableChannels, setAvailableChannels] = useState<any[]>([]);
    const [secureToken, setSecureToken] = useState<string | null>(null);

    const finishFlow = async () => {
        try {
            // Mark onboarding as complete
            const { user } = await authApi.updateOnboardingStep(ONBOARDING_STEPS.COMPLETE);
            useAuthStore.setState((s) => ({ user: { ...s.user!, onboardingStep: user.onboardingStep } }));
        } catch (error) {
            console.error('Failed to update onboarding step', error);
        }
        router.push('/dashboard');
    };

    const handleYoutubeConnectAuth = useGoogleLogin({
        flow: "auth-code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: async (codeResponse) => {
            try {
                setYoutubeStatus("authorizing");
                // Fetch channels with code
                const response = await authApi.fetchYoutubeChannels(codeResponse.code);
                const { channels, token } = response;
                
                if (!channels || channels.length === 0) {
                    setYoutubeStatus("idle");
                    console.error("No channels found");
                    return;
                }

                if (channels.length === 1) {
                    setYoutubeStatus("connecting");
                    await authApi.connectYoutube(channels[0].id, token);
                    setYoutubeStatus("connected");
                } else {
                    setAvailableChannels(channels);
                    setSecureToken(token);
                    setYoutubeStatus("selecting");
                }
            } catch (error) {
                console.error("YouTube operation failed", error);
                setYoutubeStatus("idle");
            }
        },
        onError: (error) => {
            console.error("Google Auth Error", error);
            setYoutubeStatus("idle");
        }
    });

    const handleChannelSelect = async (channelId: string) => {
        if (!secureToken) return;
        try {
            setYoutubeStatus("connecting");
            await authApi.connectYoutube(channelId, secureToken);
            setYoutubeStatus("connected");
            setAvailableChannels([]);
            setSecureToken(null);
        } catch (error) {
            console.error("YouTube connection failed", error);
            setYoutubeStatus("idle");
        }
    };

    const handleYoutubeDisconnect = async () => {
        try {
            setYoutubeStatus("connecting");
            await authApi.disconnectYoutube();
            setYoutubeStatus("idle");
        } catch (error) {
            console.error("YouTube disconnect failed", error);
            setYoutubeStatus("connected");
        }
    };

    const handleNext = async () => {
        setIsLoading(true);
        // Ensure YouTube is connected if you want to make it mandatory
        // or just proceed if it's optional.
        finishFlow();
    };

    return (

        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* <div className="card-title">Social profiles</div> */}
            <h3 className="mb-5 text-h3 text-n-1 dark:text-n-9">Connect your socials</h3>

            <div className="mb-8">
                <div className="flex items-center mb-4 pb-4 pl-3 md:pl-0 dark:border-n-6">
                    <Icon className="shrink-0 icon-20 mr-8 md:mr-4 dark:fill-n-1 text-[#ff0033]" name="youtube" />
                    <div className="mr-auto">
                        <div className="mb-1.5 text-xs font-medium text-n-3 dark:text-n-8">
                            YouTube
                        </div>
                        <div className="break-all text-sm font-bold">
                            {youtubeStatus === "connected" ? "Connected" : "Not connected"}
                        </div>
                    </div>
                    {youtubeStatus !== "connected" && youtubeStatus !== "selecting" ? (
                        <button
                            type="button"
                            onClick={() => handleYoutubeConnectAuth()}
                            disabled={youtubeStatus === "connecting" || youtubeStatus === "authorizing"}
                            className="group inline-flex items-center self-end pb-0.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            <Icon className="mr-1.5 dark:fill-n-9" name="external-link" />
                            {youtubeStatus.includes("ing") ? "Connecting..." : "Connect"}
                        </button>
                    ) : youtubeStatus === "connected" ? (
                        <button
                            type="button"
                            onClick={() => handleYoutubeDisconnect()}
                            className="group inline-flex items-center self-end pb-0.5 text-xs font-bold cursor-pointer"
                        >
                            Disconnect
                        </button>
                    ) : null}
                </div>

                {/* Channel Selector UI */}
                {youtubeStatus === "selecting" && availableChannels.length > 0 && (
                    <div className="mt-4 p-4 border border-n-3 dark:border-n-6 rounded-xl bg-n-2 dark:bg-n-7">
                        <div className="text-sm font-bold mb-3 dark:text-n-1">Select a Channel</div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {availableChannels.map((channel) => (
                                <button
                                    key={channel.id}
                                    type="button"
                                    onClick={() => handleChannelSelect(channel.id)}
                                    className="flex items-center w-full p-2 hover:bg-n-3 dark:hover:bg-n-6 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                    {channel.thumbnail ? (
                                        <img src={channel.thumbnail} alt={channel.title} className="w-8 h-8 rounded-full mr-3 shrink-0" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-n-4 dark:bg-n-5 mr-3 shrink-0"></div>
                                    )}
                                    <div className="truncate text-sm font-semibold dark:text-n-1">{channel.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <StepActions
                onNext={handleNext}
                onBack={onBack}
                isLoading={isLoading}
                nextLabel="Finish"
                showSkip={true}
                onSkip={finishFlow}
            />
        </div>
    );
};

export default Step4Socials;



