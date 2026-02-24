import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth";
import { conversationApi, userApi } from "@/lib/api";
import { Conversation, User } from "@/lib/types";

/**
 * Manages conversation fetching, recipient resolution, and the "new conversation" placeholder.
 * Extracted from MessagesPage to isolate data-fetching from UI rendering.
 */
export const useConversations = (recipientId: string | null) => {
    const { user } = useAuth();

    // Fetch conversations
    const {
        data: conversationsData,
        isLoading: isConversationsLoading,
        isError,
        error: queryError
    } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { conversations } = await conversationApi.getAll();
            return conversations;
        }
    });

    const conversations = conversationsData || [];

    // Fetch recipient user if needed (when not in existing conversations)
    const {
        data: recipientUser,
        isLoading: isRecipientLoading
    } = useQuery({
        queryKey: ['user', recipientId],
        queryFn: async () => {
            if (!recipientId) return null;
            const { user } = await userApi.getById(recipientId);
            return user;
        },
        enabled: !!recipientId && !conversations.some(c =>
            c.participants.some((p: any) => (typeof p === 'string' ? p : p._id) === recipientId)
        )
    });

    // Build final conversation list with possible "new" placeholder
    const finalConversations = useMemo(() => {
        if (!recipientId) return conversations;

        const exists = conversations.find(c =>
            c.participants.some((p: any) => (typeof p === 'string' ? p : p._id) === recipientId)
        );

        if (exists) return conversations;

        if (recipientUser && user) {
            const fakeConv: Conversation = {
                _id: 'new',
                participants: [user, recipientUser],
                creatorId: user._id,
                memberId: recipientUser._id,
                isActive: true,
                lastMessage: null,
                unreadCounts: {},
                createdAt: new Date().toISOString(),
            };
            return [fakeConv, ...conversations];
        }

        return conversations;
    }, [conversations, recipientId, recipientUser, user]);

    const isLoading = isConversationsLoading || (!!recipientId && isRecipientLoading);

    return {
        conversations,
        finalConversations,
        recipientUser,
        isLoading,
        isError,
        queryError,
        user,
    };
};
