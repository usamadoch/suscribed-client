import { useState, useEffect, useRef, useCallback } from "react";
import { InfiniteData } from "@tanstack/react-query";
import { Message } from "@/types";

type ChatMessagesPage = {
    messages: Message[];
    nextCursor: string | undefined;
};

type UseChatScrollParams = {
    messages: Message[];
    messagesData: InfiniteData<ChatMessagesPage> | undefined;
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
};

export const useChatScroll = ({
    messages,
    messagesData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: UseChatScrollParams) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const prevScrollHeightRef = useRef<number>(0);

    const scrollToBottom = useCallback((smooth = true) => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: smooth ? "smooth" : "auto",
                });
            }
        }, 50);
    }, []);

    // Initial load: Scroll to bottom instantly
    useEffect(() => {
        if (!isLoading && messages.length > 0 && !messagesData?.pages[1]) {
            scrollToBottom(false);
        }
    }, [isLoading, messages.length === 0, scrollToBottom, messagesData?.pages]);

    // Maintain scroll position after fetchNextPage
    useEffect(() => {
        if (prevScrollHeightRef.current > 0 && containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;
            if (diff > 0) {
                containerRef.current.scrollTop = diff;
                prevScrollHeightRef.current = 0;
            }
        }
    }, [messagesData?.pages.length]);

    // Auto-scroll on new message if near bottom
    useEffect(() => {
        if (shouldAutoScroll && messages.length > 0) {
            scrollToBottom(true);
        }
    }, [messages.length, shouldAutoScroll, scrollToBottom]);

    // Handle scroll for pagination + auto-scroll detection
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            // Detect "Scroll to Top" (with buffer) to load older messages
            if (scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
                prevScrollHeightRef.current = scrollHeight;
                fetchNextPage();
            }

            // Detect "Near Bottom" for auto-scroll behaviour
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShouldAutoScroll(isNearBottom);
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    return {
        containerRef,
        shouldAutoScroll,
        setShouldAutoScroll,
        handleScroll,
        scrollToBottom,
    };
};
