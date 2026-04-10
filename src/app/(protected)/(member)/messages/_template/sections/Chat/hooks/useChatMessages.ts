import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { conversationService as conversationApi } from "@/services/conversation.service";
import { Message } from "@/types";

type ChatMessagesPage = {
    messages: Message[];
    nextCursor: string | undefined;
};

export const useChatMessages = (conversationId: string | null) => {
    const {
        data: messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isPending,
    } = useInfiniteQuery({
        queryKey: ["messages", conversationId],
        queryFn: async ({ pageParam }) => {
            const { messages, pagination } = await conversationApi.getMessages(
                conversationId!,
                {
                    cursor: pageParam as string | undefined,
                    limit: 10,
                }
            );
            return {
                messages,
                nextCursor: pagination.cursor,
            } satisfies ChatMessagesPage;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!conversationId && conversationId !== "new",
        staleTime: Infinity,
    });

    // Flatten messages from all pages and reverse for display (Oldest → Newest)
    const messages = useMemo(() => {
        if (!messagesData) return [];
        const allMessages = messagesData.pages.flatMap(
            (page) => page.messages
        );
        return [...allMessages].reverse();
    }, [messagesData]);

    return {
        messages,
        messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isPending,
    };
};
