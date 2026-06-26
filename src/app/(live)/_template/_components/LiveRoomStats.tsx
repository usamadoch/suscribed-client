"use client";

import { useQuery } from "@tanstack/react-query";
import { liveApi } from "@/services/live.service";

interface LiveRoomStatsProps {
    sessionId: string;
    isLive?: boolean;
}

export default function LiveRoomStats({ sessionId, isLive }: LiveRoomStatsProps) {
    const { data: sessionStats } = useQuery({
        queryKey: ["liveSessionStats", sessionId],
        queryFn: () => liveApi.getSessionStats(sessionId),
        enabled: !!sessionId,
        refetchInterval: isLive ? 60000 : false,
    });

    return (
        <>
            {/* 3 stats boxes */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className=" border border-n-4 dark:border-n-6 rounded-xl p-4 text-center">
                    <div className="text-xs font-bold  dark:text-n-7 mb-1 uppercase tracking-wider">Collected</div>
                    <div className="text-h4 font-bold dark:text-purple-1">Rs {sessionStats?.collected?.toLocaleString() || 0}</div>
                </div>
                <div className=" border border-n-4 dark:border-n-6 rounded-xl p-4 text-center">
                    <div className="text-xs font-bold  dark:text-n-7 mb-1 uppercase tracking-wider">
                        {sessionStats?.status === 'ended' ? "Peak Viewers" : "Watching"}
                    </div>
                    <div className="text-h4 font-bold dark:text-n-9">
                        {sessionStats?.status === 'ended' ? (sessionStats?.peakViewers || 0) : (sessionStats?.watching || 0)}
                    </div>
                </div>
                <div className=" dark:bg-n-1 border border-n-4 dark:border-n-6 rounded-xl p-4 text-center">
                    <div className="text-xs font-bold  dark:text-n-7 mb-1 uppercase tracking-wider">Paid msgs</div>
                    <div className="text-h4 font-bold  dark:text-n-9">{sessionStats?.paidMsgs || 0}</div>
                </div>
            </div>

            {/* Top Supporters */}
            <h2 className="text-lg font-bold dark:text-n-9 mb-4">Top Supporters</h2>
            <div className="border border-n-4 dark:border-n-6 rounded-xl">
                {(sessionStats?.topSupporters || []).length > 0 ? sessionStats!.topSupporters.map(supporter => (
                    <div key={supporter.rank} className="flex items-center justify-between px-4 py-2 border-b border-n-4 dark:border-n-6 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-1 text-white text-xs font-bold shrink-0 shadow-sm">
                                {supporter.rank}
                            </div>
                            <div className="font-bold text-n-1 dark:text-n-9 text-sm">
                                {supporter.name}
                            </div>
                        </div>
                        <div className="font-bold text-purple-1 text-sm">
                            {supporter.amount}
                        </div>
                    </div>
                )) : (
                    <div className="px-4 py-8 text-center text-n-5 dark:text-n-7 text-sm font-medium">
                        No supporters yet
                    </div>
                )}
            </div>
        </>
    );
}
