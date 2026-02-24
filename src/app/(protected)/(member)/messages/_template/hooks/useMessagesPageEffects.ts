import { useEffect } from "react";
import { useSocket } from "@/store/socket";
import { Conversation, User } from "@/lib/types";

/**
 * Manages MessagesPage navigation side-effects:
 * - Resets message badge on mount, restores on unmount
 * - Syncs `activeId` based on URL `recipientId` or first conversation
 *
 * Extracted from MessagesPage to isolate side-effects from rendering.
 */
export const useMessagesPageEffects = ({
    recipientId,
    conversations,
    recipientUser,
    activeId,
    setActiveId,
    setVisible,
}: {
    recipientId: string | null;
    conversations: Conversation[];
    recipientUser: User | null | undefined;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    setVisible: (visible: boolean) => void;
}) => {
    const { setIsOnMessagesPage, resetMessageUnreadCount } = useSocket();

    // Mark as "on messages page" — reset badge on mount, restore on unmount
    useEffect(() => {
        setIsOnMessagesPage(true);
        resetMessageUnreadCount();

        return () => {
            setIsOnMessagesPage(false);
        };
    }, [setIsOnMessagesPage, resetMessageUnreadCount]);

    // Sync activeId based on URL params and conversation data
    useEffect(() => {
        if (recipientId) {
            const exists = conversations.find(c =>
                c.participants.some((p: any) => (typeof p === 'string' ? p : p._id) === recipientId)
            );
            if (exists) {
                setActiveId(exists._id);
            } else if (recipientUser) {
                setActiveId('new');
            }
            if (window.innerWidth < 1024) setVisible(true);
        } else if (conversations.length > 0 && !activeId) {
            setActiveId(conversations[0]._id);
        }
    }, [recipientId, conversations, recipientUser, activeId, setActiveId, setVisible]);
};
