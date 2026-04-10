import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { conversationService as conversationApi } from "@/services/conversation.service";
import { Message, User } from "@/types";

type UseSendMessageParams = {
    conversationId: string | null;
    currentUserId: string | undefined;
    recipientUser: User | null;
    setActiveId: (id: string) => void;
    onMessageSent: (message: Message) => void;
    setShouldAutoScroll: (value: boolean) => void;
};

export const useSendMessage = ({
    conversationId,
    currentUserId,
    recipientUser,
    setActiveId,
    onMessageSent,
    setShouldAutoScroll,
}: UseSendMessageParams) => {
    const [value, setValue] = useState("");
    const queryClient = useQueryClient();

    const handleSend = useCallback(async () => {
        if (!value.trim() || !conversationId) return;

        try {
            let currentConversationId = conversationId;

            // Create conversation first if this is a new thread
            if (currentConversationId === "new" && recipientUser) {
                const { conversation } = await conversationApi.start({
                    recipientId: recipientUser._id,
                });
                currentConversationId = conversation._id;

                queryClient.setQueryData(
                    ["conversations"],
                    (oldData: any) => {
                        if (!oldData) return [conversation];
                        return [conversation, ...oldData];
                    }
                );

                setActiveId(currentConversationId);
            }

            const tempId = `temp-${Date.now()}`;
            const tempMessage: Omit<Message, "status"> & {
                status: "sending";
            } = {
                _id: tempId,
                conversationId: currentConversationId,
                senderId: currentUserId || "",
                content: value,
                contentType: "text",
                attachments: [],
                status: "sending",
                isRead: false,
                readAt: null,
                createdAt: new Date().toISOString(),
            };

            // Optimistic update
            queryClient.setQueryData(
                ["messages", currentConversationId],
                (oldData: any) => {
                    if (!oldData) {
                        return {
                            pages: [
                                { messages: [tempMessage], nextCursor: null },
                            ],
                            pageParams: [undefined],
                        };
                    }

                    const newPages = [...oldData.pages];
                    const firstPage = { ...newPages[0] };
                    firstPage.messages = [tempMessage, ...firstPage.messages];
                    newPages[0] = firstPage;

                    return { ...oldData, pages: newPages };
                }
            );

            setValue("");
            setShouldAutoScroll(true);

            const { message } = await conversationApi.sendMessage(
                currentConversationId,
                { content: value }
            );

            // Replace temp message with real one
            queryClient.setQueryData(
                ["messages", currentConversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;

                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        messages: page.messages.map((m: Message) =>
                            m._id === tempId ? message : m
                        ),
                    }));

                    return { ...oldData, pages: newPages };
                }
            );

            onMessageSent(message);
        } catch (e) {
            console.error(e);
        }
    }, [
        value,
        conversationId,
        currentUserId,
        recipientUser,
        setActiveId,
        onMessageSent,
        setShouldAutoScroll,
        queryClient,
    ]);

    return { value, setValue, handleSend };
};
