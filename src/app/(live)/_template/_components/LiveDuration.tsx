"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/Skeleton";

type LiveDurationProps = {
    startedAt?: string;
    endedAt?: string;
    isLoading?: boolean;
};

const LiveDuration = ({ startedAt, endedAt, isLoading }: LiveDurationProps) => {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        if (!startedAt || endedAt) return;
        setNow(new Date());
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, [startedAt, endedAt]);

    if (isLoading) {
        return <Skeleton className="w-24 h-4 mt-1" />;
    }

    if (!startedAt) {
        return null;
    }

    const endTime = endedAt ? new Date(endedAt).getTime() : (now ? now.getTime() : null);

    if (!endTime) return null;

    const diff = endTime - new Date(startedAt).getTime();
    if (diff < 0) return <>0m</>;
    
    const minutes = Math.floor(diff / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    
    return <>{h > 0 ? `${h}h ${m}m` : `${m}m`}</>;
};

export default LiveDuration;
