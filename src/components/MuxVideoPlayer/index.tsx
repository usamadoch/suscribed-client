"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Mux player
const MuxPlayer = dynamic(
    () => import("@mux/mux-player-react").then((mod) => mod.default),
    { ssr: false }
);

type MuxVideoPlayerProps = {
    playbackId?: string;
    status?: "preparing" | "ready" | "errored";
    fallbackSrc?: string; // For local preview before upload
    className?: string;
    autoPlay?: boolean;
};

/**
 * Mux Video Player component with states for preparing/ready/error
 * Priority: playbackId+ready > fallback > preparing state > error
 */
const MuxVideoPlayer = ({
    playbackId,
    status,
    fallbackSrc,
    className = "",
    autoPlay = false,
}: MuxVideoPlayerProps) => {
    // Show Mux player if ready OR if we have a local source (to use Mux UI for pending videos)
    if ((playbackId && status === "ready") || fallbackSrc) {
        return (
            <Suspense fallback={<div className={`bg-n-2 dark:bg-n-1 animate-pulse ${className}`} />}>
                <MuxPlayer
                    playbackId={status === "ready" ? playbackId : undefined}
                    src={status === "ready" ? undefined : fallbackSrc}
                    streamType="on-demand"
                    autoPlay={autoPlay}
                    className={className}
                    style={{
                        width: "100%",
                        height: "100%",
                        "--media-accent-color": "#ae7affe6",
                        "--media-range-bar-color": "#ae7affe6",
                    }}
                />
            </Suspense>
        );
    }

    // Show error state
    if (status === "errored") {
        return (
            <div className={`bg-red-50 dark:bg-red-900/20 flex items-center justify-center ${className}`}>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-red-500 text-2xl">⚠</span>
                    <span className="text-sm text-red-500">Video processing failed</span>
                </div>
            </div>
        );
    }

    // Native video fallback removed - MuxPlayer handles fallbackSrc now

    // Show processing indicator when no fallback available (post detail page while Mux processes)
    // This happens after post is created but before Mux webhook updates with playbackId
    return (
        <div className={`relative bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
                </div>
                <div>
                    <p className="text-white font-medium mb-1">Video is processing...</p>
                    <p className="text-white/60 text-sm">This usually takes 30-60 seconds</p>
                    <p className="text-white/40 text-xs mt-2">Refresh the page to check status</p>
                </div>
            </div>
        </div>
    );
};

export default MuxVideoPlayer;
