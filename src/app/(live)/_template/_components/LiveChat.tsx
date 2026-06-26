"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";
import { ArrowDown } from "@/lib/icons";
import Tabs from "@/components/Tabs";
import LiveChatInput from "./LiveChatInput";
import { useLiveSocket, YouTubeMessage, CommonsMessage, LiveMessage } from "./hooks/useLiveSocket";
import PinnedSuperchats from "./PinnedSuperchats";
import LiveChatMessageItem from "./LiveChatMessageItem";
import { useAuth } from "@/store/auth";
import { liveApi } from "@/services/live.service";
import { useQuery } from "@tanstack/react-query";

interface LiveChatProps {
    sessionId?: string;
    isLive?: boolean;
}

const chatTabs = [
    { title: "Live Chat", value: "live" },
    { title: "Top Chat", value: "top" },
];

export default function LiveChat({ sessionId, isLive }: LiveChatProps) {
    const [activeTab, setActiveTab] = useState<string>("live");
    const [messages, setMessages] = useState<LiveMessage[]>([]);
    const [isScrolledUp, setIsScrolledUp] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [mutedUntil, setMutedUntil] = useState<Date | null>(null);

    // Assuming we can know if the current user is creator. Wait, we can get current user.

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { user } = useAuth();
    const { data: sessionData } = useQuery({
        queryKey: ["publicLiveSession", sessionId],
        queryFn: () => liveApi.getPublicSession(sessionId as string),
        enabled: !!sessionId,
    });

    // sessionData.creatorId can be a string or an object with userId
    const creatorUserId = typeof sessionData?.creatorId === 'object'
        ? (sessionData.creatorId as any).userId || sessionData.creatorId._id
        : sessionData?.creatorId;

    const isCreator = user && creatorUserId === user._id;

    const scrollRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const scrolled = Math.abs(scrollRef.current.scrollTop) > 50;
        setIsScrolledUp(scrolled);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    const mergeMessages = useCallback((prev: LiveMessage[], incoming: LiveMessage[]): LiveMessage[] => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMsgs = incoming.filter(m => !existingIds.has(m.id));
        if (newMsgs.length === 0) return prev;

        const merged = [...prev, ...newMsgs];
        merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return merged.slice(-200);
    }, []);

    const handleChatHistory = useCallback((historyMessages: LiveMessage[]) => {
        setMessages(prev => mergeMessages(prev, historyMessages));
    }, [mergeMessages]);

    const handleYouTubeMessages = useCallback((ytMessages: YouTubeMessage[]) => {
        setMessages(prev => mergeMessages(prev, ytMessages));
    }, [mergeMessages]);

    const handleChatMessage = useCallback((msg: CommonsMessage) => {
        setMessages(prev => mergeMessages(prev, [msg]));
    }, [mergeMessages]);

    const handleSessionEnded = useCallback(() => {
        if (sessionId) {
            queryClient.invalidateQueries({ queryKey: ["publicLiveSession", sessionId] });
            queryClient.invalidateQueries({ queryKey: ["liveSession", sessionId] });
        }
    }, [sessionId, queryClient]);

    const handleMessageRemoved = useCallback((msgId: string) => {
        setMessages(prev => prev.filter(m => m.id !== msgId));
    }, []);

    const handleUserMuted = useCallback((data: { userId: string, mutedUntil: string }) => {
        if (user && data.userId === user._id) {
            setMutedUntil(new Date(data.mutedUntil));
        }
    }, [user]);

    useLiveSocket({
        sessionId,
        enabled: isLive,
        onChatHistory: handleChatHistory,
        onYouTubeMessages: handleYouTubeMessages,
        onChatMessage: handleChatMessage,
        onSessionEnded: handleSessionEnded,
        onMessageRemoved: handleMessageRemoved,
        onUserMuted: handleUserMuted,
    });

    const displayMessages = activeTab === "live"
        ? messages
        : messages.filter(m => m.source === "commons" && m.type === "paid");

    return (
        <>
            <div className="pb-4 px-5 border-b border-n-4 dark:border-n-6 shrink-0">
                <div className="flex items-center justify-between">
                    <Tabs items={chatTabs} value={activeTab} setValue={setActiveTab} />
                    <button className="text-sm font-bold text-n-4 hover:text-n-1 dark:text-n-5 dark:hover:text-n-3 transition-colors flex items-center gap-1">
                        ⚙ Mod
                    </button>
                </div>
                <PinnedSuperchats messages={messages} now={now} />
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col px-5">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-n-4 dark:scrollbar-thumb-n-6 flex flex-col-reverse gap-2 pb-2"
                >
                    {displayMessages.length > 0 && (
                        [...displayMessages].reverse().map(msg => (
                            <div key={msg.id} className="text-sm animate-in fade-in duration-300">
                                <LiveChatMessageItem msg={msg} isCreator={!!isCreator} sessionId={sessionId} />
                            </div>
                        ))
                    )}
                </div>
                {isScrolledUp && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 btn btn-square btn-stroke h-8 w-8 p-0 flex items-center border dark:border-n-1 justify-center bg-purple-1 hover:bg-purple-2 rounded-full transition-all z-10"
                    >
                        <Icon icon={ArrowDown} strokeWidth={2.5} className="text-n-1 dark:text-n-9" />
                    </button>
                )}
            </div>

            <LiveChatInput sessionId={sessionId} isLive={isLive} mutedUntil={mutedUntil} isCreator={!!isCreator} />
        </>
    );
}
