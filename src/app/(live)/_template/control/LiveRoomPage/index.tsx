"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Field from "@/components/Field";
import LiveHeader from "../../_components/LiveHeader";
import LiveDuration from "../../_components/LiveDuration";
import LiveLayout from "../../_components/LiveLayout";
import LiveChat from "../../_components/LiveChat";
import LiveRoomStats from "../../_components/LiveRoomStats";
import { Icon } from "@/components/ui/icon";
import { Clock, CheckCircle, Copy } from "@/lib/icons";
import { Skeleton } from "@/components/Skeleton";
import Alert from "@/components/Alert";
import { APP_URL } from "@/lib/utils";
import { liveApi } from "@/services/live.service";
import EndStreamModal from "@/components/modals/EndStreamModal";

const LiveRoomControlPage = () => {
    const params = useParams();
    const sessionId = params?.id as string;
    const queryClient = useQueryClient();
    const appUrl = APP_URL;

    const [isEndModalVisible, setIsEndModalVisible] = useState(false);

    const { data: sessionData, isLoading } = useQuery({
        queryKey: ["liveSession", sessionId],
        queryFn: () => liveApi.getSession(sessionId),
        enabled: !!sessionId,
    });

    const endSessionMutation = useMutation({
        mutationFn: () => liveApi.endSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveSession", sessionId] });
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="success"
                    message="Stream ended successfully"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
            setIsEndModalVisible(false);
        },
        onError: (error: any) => {
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="error"
                    message={error?.response?.data?.error?.message || "Failed to end stream"}
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        }
    });

    const isEnded = sessionData?.status === "ended";


    return (
        <LiveLayout
            sidebarWidthClass="w-[32rem] min-w-[32rem]"
            sidebarClassName="flex flex-col"
            sidebar={<LiveChat sessionId={sessionId} isLive={sessionData?.status === 'live'} />}
        >
            <LiveHeader
                title={isLoading ? <Skeleton className="w-48 h-6" /> : sessionData?.title}
                duration={
                    isEnded ? (
                        <div className="flex items-center gap-2 font-medium text-n-7">
                            <span className="flex items-center gap-1.5">
                                <Icon icon={Clock} className="w-3 h-3" />
                                {sessionData?.startedAt ? new Date(sessionData.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
                                {' · '}
                                {sessionData?.startedAt ? new Date(sessionData.startedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--:--'}
                                {' – '}
                                {sessionData?.endedAt ? new Date(sessionData.endedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--:--'}
                            </span>
                        </div>
                    ) : (
                        <LiveDuration startedAt={sessionData?.startedAt} isLoading={isLoading} />
                    )
                }
                showCopyLink={!isEnded}
                showEndStream={!isEnded}
                isEnded={isEnded}
                onCopyLink={() => {
                    navigator.clipboard.writeText(`${appUrl}/live-room/${sessionId}`);
                    toast.custom((t) => (
                        <Alert
                            className="mb-0"
                            type="success"
                            message="Link copied to clipboard!"
                            onClose={() => toast.dismiss(t.id)}
                        />
                    ), { position: "bottom-right" });
                }}
                onEndStream={() => setIsEndModalVisible(true)}
            />

            {/* Reduced height stream preview */}
            <div className="w-full aspect-video max-h-[75vh] transition-all duration-300 ease-in-out bg-black rounded-xl border border-n-4 dark:border-n-6 overflow-hidden flex flex-col items-center justify-center relative group shadow-primary-4 shrink-0">
                {isEnded ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-purple-1/20 to-purple-1/5 flex items-center justify-center mx-auto mb-6 border border-purple-1/30 ">
                                <Icon icon={CheckCircle} className="w-10 h-10 text-purple-1" />
                            </div>
                            <h3 className="text-h3 font-bold select-none dark:text-n-9 tracking-tight mb-2">
                                Stream Ended
                            </h3>
                            <p className="text-n-7 text-sm font-medium max-w-xs mx-auto">
                                The live session has concluded.
                            </p>
                        </div>
                    </div>
                ) : sessionData?.youtubeVideoId ? (
                    <iframe
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${sessionData.youtubeVideoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-md mx-auto w-fit mb-4">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                                Live
                            </span>
                            <div className="text-white/50 text-h4 font-bold select-none">
                                Stream Preview
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <LiveRoomStats sessionId={sessionId} isLive={sessionData?.status === 'live'} />

            {/* Share with audience */}
            {!isEnded && (
                <div className=" dark:bg-n-1 dark:border dark:border-n-6 rounded-xl p-4 shrink-0 lg:mb-0">
                    <h2 className="text-sm uppercase font-bold dark:text-n-9 mb-4">Share with your audience</h2>
                    <Field
                        className="mb-4"
                        classInput="h-10 text-xs"
                        value={`${appUrl}/live-room/${sessionId}`}
                        disabled
                    />
                    <div className="flex gap-3 md:flex-col">
                        <button
                            className="btn btn-stroke btn-small"
                            onClick={() => {
                                navigator.clipboard.writeText(`${appUrl}/live-room/${sessionId}`);
                                toast.custom((t) => (
                                    <Alert
                                        className="mb-0 shadow-md"
                                        type="success"
                                        message="Link copied to clipboard!"
                                        onClose={() => toast.dismiss(t.id)}
                                    />
                                ), { position: "bottom-right" });
                            }}
                        >
                            <Icon icon={Copy} className="" /> Copy link
                        </button>
                    </div>
                </div>
            )}


            <EndStreamModal
                visible={isEndModalVisible}
                onClose={() => setIsEndModalVisible(false)}
                onEnd={() => endSessionMutation.mutate()}
                isPending={endSessionMutation.isPending}
            />
        </LiveLayout>
    );
};

export default LiveRoomControlPage;