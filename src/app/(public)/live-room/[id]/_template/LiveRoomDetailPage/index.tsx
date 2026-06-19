"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { liveApi } from "@/services/live.service";
import { isValidObjectId } from "@/lib/validation";
import { useAuth } from "@/store/auth";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import LiveChat from "@/app/(live)/_template/_components/LiveChat";
import ContentHeader from "@/components/ContentHeader";
import LockedContent from "@/app/(public)/posts/[id]/_template/PostDetailPage/LockedContent";
import LiveLayout from "@/app/(live)/_template/_components/LiveLayout";

// ─── Component ──────────────────────────────────────────────

const LiveRoomDetailPage = () => {
    const params = useParams<{ id: string }>();
    const sessionId = params.id as string;
    const { user } = useAuth();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const isValidId = isValidObjectId(sessionId);

    const {
        data: session,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["publicLiveSession", sessionId],
        queryFn: () => liveApi.getPublicSession(sessionId),
        enabled: !!sessionId && isValidId,
        retry: false,
    });

    // ── Error / Not Found States ─────────────────────────────
    const apiError = error as any;
    const statusCode = apiError?.status;

    const handleJoin = () => {
        if (!user) {
            setIsLoginModalOpen(true);
        }
    };

    // 401 or 403 — locked content
    if (statusCode === 401 || statusCode === 403) {
        return (
            <div className="max-w-4xl mx-auto w-full p-5 mt-20">
                <LockedContent
                    handleJoin={handleJoin}
                    user={user}
                    isLoginModalOpen={isLoginModalOpen}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                    title="Live Session"
                    text={statusCode === 401
                        ? "This live session is exclusive to members. Please log in to access it."
                        : (apiError?.message || "Join this creator's community to access this live session.")}
                />
            </div>
        );
    }

    // 404 or invalid ID
    if (!isValidId || (!isLoading && !session)) {
        return (
            <div className="p-10 text-center text-n-1 dark:text-n-8">
                Session not found
            </div>
        );
    }

    // ── Loading State ────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader />
            </div>
        );
    }

    // ── Derived State ────────────────────────────────────────
    const isEnded = session?.status === "ended";
    const isLive = session?.status === "live";


    return (
        <LiveLayout
            sidebarWidthClass="w-[32rem] min-w-[32rem]"
            leftClassName="mx-0 py-0"
            sidebarClassName="flex flex-col"
            className="h-[calc(100vh-57px)]"
            sidebar={<LiveChat sessionId={sessionId} isLive={isLive} />}
        >
            {/* Stream Preview */}
            <div className="w-full aspect-video max-h-[75vh] bg-black overflow-hidden flex flex-col items-center justify-center relative group shrink-0">
                {isEnded ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-purple-1/20 to-purple-1/5 flex items-center justify-center mx-auto mb-6 border border-purple-1/30">
                                <Icon name="check-circle" className="w-10 h-10 text-purple-1" />
                            </div>
                            <h3 className="text-h3 font-bold select-none dark:text-n-9 tracking-tight mb-2">
                                Stream Ended
                            </h3>
                            <p className="text-n-7 text-sm font-medium max-w-xs mx-auto">
                                This live session has concluded.
                            </p>
                            {session?.startedAt && (
                                <p className="text-n-5 text-xs font-medium mt-3">
                                    {new Date(session.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {' · '}
                                    {new Date(session.startedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    {session?.endedAt && (
                                        <>
                                            {' – '}
                                            {new Date(session.endedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                ) : session?.youtubeVideoId ? (
                    <iframe
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${session.youtubeVideoId}?autoplay=1`}
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

            {/* Content Header (Creator & Metadata) */}
            {session?.creatorId && (
                <div>
                    <ContentHeader
                        creator={{
                            displayName: session.creatorId.displayName || 'Creator',
                            avatarUrl: session.creatorId.avatarUrl,
                        }}
                        date={session.startedAt || session.createdAt}
                        locked={session.isLocked}
                        titleOrCaption={session.title}
                        badges={
                            <>
                                {isLive && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-md shrink-0">
                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                        Live
                                    </span>
                                )}
                                {isEnded && (
                                    <span className="bg-n-4 dark:bg-n-6 text-n-1 dark:text-n-8 text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shrink-0">
                                        Ended
                                    </span>
                                )}
                            </>
                        }
                    />
                </div>
            )}
        </LiveLayout>
    );
};

export default LiveRoomDetailPage;