import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/store/socket";
import { Conversation, Message } from "@/lib/types";

/**
 * Handles real-time socket updates for the conversation list:
 * - Listens for `new_message_notification` to update last message + unread counts
 * - Provides `handleMessageSent` to optimistically update after sending
 *
 * Extracted from MessagesPage to isolate socket side-effects from rendering.
 */
export const useConversationSocket = (userId: string | undefined) => {
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    // Listen for real-time incoming message notifications
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewMessageNotification = ({ conversationId, message }: any) => {
            queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
                if (!oldData) return oldData;

                const updated = oldData.map(conv => {
                    if (conv._id === conversationId) {
                        return {
                            ...conv,
                            lastMessage: {
                                content: message.content,
                                senderId: message.senderId,
                                sentAt: message.createdAt,
                            },
                            unreadCounts: {
                                ...conv.unreadCounts,
                                [userId || '']: (conv.unreadCounts?.[userId || ''] || 0) + 1,
                            },
                        };
                    }
                    return conv;
                });

                // Move updated conversation to top
                const index = updated.findIndex(c => c._id === conversationId);
                if (index > 0) {
                    const [conv] = updated.splice(index, 1);
                    updated.unshift(conv);
                } else if (index === -1) {
                    // New conversation started by someone else
                    queryClient.invalidateQueries({ queryKey: ['conversations'] });
                }

                return updated;
            });
        };

        socket.on('new_message_notification', handleNewMessageNotification);

        return () => {
            socket.off('new_message_notification', handleNewMessageNotification);
        };
    }, [socket, isConnected, userId, queryClient]);

    // Stable callback for optimistic update after sending a message
    const handleMessageSent = useCallback((message: Message) => {
        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
            if (!oldData) return oldData;

            let updated = oldData.map(conv => {
                if (conv._id === message.conversationId) {
                    return {
                        ...conv,
                        lastMessage: {
                            content: message.content,
                            senderId: typeof message.senderId === 'string' ? message.senderId : message.senderId._id,
                            sentAt: message.createdAt,
                        },
                    };
                }
                return conv;
            });

            // Move to top
            const index = updated.findIndex(c => c._id === message.conversationId);
            if (index > 0) {
                const [conv] = updated.splice(index, 1);
                updated.unshift(conv);
            }
            return updated;
        });
    }, [queryClient]);

    return { handleMessageSent };
};
