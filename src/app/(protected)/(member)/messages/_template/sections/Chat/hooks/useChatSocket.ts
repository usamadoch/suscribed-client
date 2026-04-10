import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types";
import { useSocket } from "@/store/socket";

type UseChatSocketParams = {
    conversationId: string | null;
    currentUserId: string | undefined;
    setIsTyping: (typing: boolean) => void;
};

/**
 * Manages socket event listeners for a single chat conversation:
 * - Joins/leaves the conversation room
 * - Listens for new messages (from other users only)
 * - Listens for typing indicators
 * - Listens for message read-status updates
 */
export const useChatSocket = ({
    conversationId,
    currentUserId,
    setIsTyping,
}: UseChatSocketParams) => {
    const { socket, isConnected, setActiveConversationId } = useSocket();
    const queryClient = useQueryClient();

    // Track actively viewed conversation for unread-badge suppression
    useEffect(() => {
        if (conversationId && conversationId !== "new") {
            setActiveConversationId(conversationId);
        }
        return () => setActiveConversationId(null);
    }, [conversationId, setActiveConversationId]);

    // Socket event listeners for the conversation room
    useEffect(() => {
        if (
            !socket ||
            !isConnected ||
            !conversationId ||
            conversationId === "new"
        )
            return;

        socket.emit("join_room", { conversationId });

        // ── New message (from OTHER users only) ──
        const handleNewMessage = (message: Message) => {
            const senderId =
                typeof message.senderId === "string"
                    ? message.senderId
                    : message.senderId._id;

            // Skip our own messages (already added via optimistic update)
            if (senderId === currentUserId) return;

            queryClient.setQueryData(
                ["messages", conversationId],
                (oldData: any) => {
                    if (!oldData)
                        return {
                            pages: [
                                { messages: [message], nextCursor: null },
                            ],
                            pageParams: [undefined],
                        };

                    const newPages = [...oldData.pages];
                    const firstPage = { ...newPages[0] };

                    // Deduplicate
                    if (
                        firstPage.messages.some(
                            (m: Message) => m._id === message._id
                        )
                    )
                        return oldData;

                    firstPage.messages = [message, ...firstPage.messages];
                    newPages[0] = firstPage;

                    return { ...oldData, pages: newPages };
                }
            );
        };

        // ── Typing indicators ──
        const handleTyping = ({
            userId,
        }: {
            userId: string;
            conversationId: string;
        }) => {
            if (userId !== currentUserId) setIsTyping(true);
        };

        const handleStopTyping = ({ userId }: { userId: string }) => {
            if (userId !== currentUserId) setIsTyping(false);
        };

        // ── Message read status ──
        const handleMessageRead = ({ messageId }: { messageId: string }) => {
            queryClient.setQueryData(
                ["messages", conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;

                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        messages: page.messages.map((m: Message) =>
                            m._id === messageId ? { ...m, isRead: true } : m
                        ),
                    }));

                    return { ...oldData, pages: newPages };
                }
            );
        };

        socket.on("new_message", handleNewMessage);
        socket.on("user_typing", handleTyping);
        socket.on("user_stopped_typing", handleStopTyping);
        socket.on("message_read", handleMessageRead);

        return () => {
            socket.emit("leave_room", { conversationId });
            socket.off("new_message", handleNewMessage);
            socket.off("user_typing", handleTyping);
            socket.off("user_stopped_typing", handleStopTyping);
            socket.off("message_read", handleMessageRead);
        };
    }, [socket, isConnected, conversationId, currentUserId, queryClient, setIsTyping]);
};
