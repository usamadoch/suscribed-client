"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";

type LiveLayoutProps = {
    children: React.ReactNode;        // Left side main content
    sidebar: React.ReactNode;         // Right side sidebar content
    leftClassName?: string;           // Optional overrides for the left column
    sidebarClassName?: string;        // Optional overrides for the right column (e.g., width, display flex)
    sidebarWidthClass?: string;       // The width class to use when expanded (default w-100 min-w-100)
    className?: string;               // Optional overrides for the outer wrapper
};

const LiveLayout = ({
    children,
    sidebar,
    leftClassName = "",
    sidebarClassName = "",
    sidebarWidthClass = "w-100 min-w-100",
    className = "h-screen",
}: LiveLayoutProps) => {
    const [isChatMinimized, setIsChatMinimized] = useState(false);



    return (
        <div className={twMerge("flex relative w-full overflow-hidden", className)}>
            {/* Left side content */}
            <div
                className={twMerge(
                    "group/layout grow mx-5 flex flex-col h-full overflow-y-auto scrollbar-none space-y-5 py-4 transition-all duration-300 ease-in-out",
                    leftClassName
                )}
                data-chat-minimized={isChatMinimized}
            >
                {children}
            </div>

            {/* Toggle Button wrapper placed between left and right */}
            <div className={twMerge(
                "relative z-20 shrink-0 h-full",
                isChatMinimized ? "w-0" : ""
            )}>
                <button
                    onClick={() => setIsChatMinimized(prev => !prev)}
                    className={twMerge(
                        "absolute bottom-6 z-20 w-10 h-10 btn btn-square btn-stroke rounded-full transition-all duration-300",
                        isChatMinimized ? "-left-14 rotate-180" : "-left-5"
                    )}
                    title={isChatMinimized ? "Expand Chat" : "Minimize Chat"}
                >
                    <Icon name="arrow-next" className="w-5 h-5 fill-n-4 dark:fill-n-3" />
                </button>
            </div>

            {/* Right side content (Sidebar) wrapper with smooth transition */}
            <div className={twMerge(
                "shrink-0 sticky top-0 h-full transition-[width,min-width] duration-300 ease-in-out overflow-hidden border-l border-n-4 dark:border-n-6 shadow-sm dark:bg-n-1",
                isChatMinimized ? "w-0 min-w-0 border-none" : sidebarWidthClass
            )}>
                {/* Inner Content that retains its width to prevent squishing */}
                <div className={twMerge(
                    "h-full py-4 transition-opacity duration-200",
                    sidebarWidthClass,
                    isChatMinimized ? "opacity-0 pointer-events-none" : "opacity-100",
                    sidebarClassName
                )}>
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default LiveLayout;
