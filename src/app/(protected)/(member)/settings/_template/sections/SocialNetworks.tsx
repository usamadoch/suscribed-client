
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import Icon from "@/components/Icon";

import { authService as authApi } from "@/services/auth.service";
import { pageService as pageApi } from "@/services/page.service";
import Loader from "@/components/Loader";

type SocialNetworksProps = {};

const SocialNetworks = ({ }: SocialNetworksProps) => {
    const [youtubeStatus, setYoutubeStatus] = useState<"loading" | "idle" | "authorizing" | "selecting" | "connecting" | "connected">("loading");
    const [channelName, setChannelName] = useState<string | null>(null);
    const [availableChannels, setAvailableChannels] = useState<any[]>([]);
    const [secureToken, setSecureToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { page } = await pageApi.getMyPage();
                // @ts-ignore
                if (page?.youtube?.isVerified) {
                    setYoutubeStatus("connected");
                    // @ts-ignore
                    setChannelName(page.youtube.channelName);
                } else {
                    setYoutubeStatus("idle");
                }
            } catch (error) {
                console.error("Failed to fetch page status", error);
                setYoutubeStatus("idle");
            }
        };
        fetchStatus();
    }, []);

    const handleYoutubeConnectAuth = useGoogleLogin({
        flow: "auth-code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: async (codeResponse) => {
            try {
                setYoutubeStatus("authorizing");
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

                    const { page } = await pageApi.getMyPage();
                    if (page?.youtube?.isVerified) {
                        setYoutubeStatus("connected");
                        setChannelName(page.youtube.channelName);
                    }
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

            const { page } = await pageApi.getMyPage();
            if (page?.youtube?.isVerified) {
                setYoutubeStatus("connected");
                setChannelName(page.youtube.channelName);
            }

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
            setChannelName(null);
        } catch (error) {
            console.error("YouTube disconnect failed", error);
            setYoutubeStatus("connected");
        }
    };

    return (
        <div className="card">
            <div className="card-title">Social profiles</div>
            <div className="p-5">
                <div>
                    {/* YouTube Specific Block */}
                    {youtubeStatus === "loading" ? (
                        <div className="flex items-center justify-center h-10">
                            <Loader />
                        </div>
                    ) : (
                        <div className="flex items-center mb-4 md:pl-0 dark:border-n-6">
                            <Icon className="shrink-0 icon-20 mr-8 md:mr-4 dark:fill-n-1 text-[#ff0033]" name="youtube" />
                            <div className="mr-auto">
                                <div className="mb-1.5 text-xs font-medium text-n-3 dark:text-n-8">
                                    YouTube
                                </div>
                                <div className="break-all text-sm font-bold dark:text-n-9">
                                    {youtubeStatus === "connected" ? (channelName || "Connected") : "Not conneted"}
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
                                    className="group inline-flex items-center self-end pb-0.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                                >
                                    Disconnect
                                </button>
                            ) : null}
                        </div>
                    )}

                    {/* Channel Selector UI */}
                    {youtubeStatus === "selecting" && availableChannels.length > 0 && (
                        <div className="mt-4 mb-4 p-4 border border-n-3 dark:border-n-6 rounded-xl bg-n-2 dark:bg-n-7">
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


            </div>
        </div>
    );
};

export default SocialNetworks;
