import { useState, useEffect } from "react";
import { Message, User } from "@/types";

type OtherUserInfo = {
    displayName: string;
    avatarUrl?: string;
};

/**
 * Resolves the "other user" in a conversation.
 *
 * Priority:
 * 1. If `recipientUser` is provided (new-conversation flow), use it directly.
 * 2. Otherwise, extract from populated `senderId` in messages.
 */
export const useOtherUser = (
    messages: Message[],
    recipientUser: User | null,
    currentUserId: string | undefined
) => {
    const [otherUser, setOtherUser] = useState<OtherUserInfo | null>(null);

    // Derive from recipientUser prop (takes priority)
    useEffect(() => {
        if (recipientUser) {
            setOtherUser({
                displayName: recipientUser.displayName,
                avatarUrl: recipientUser.avatarUrl || undefined,
            });
        }
    }, [recipientUser]);

    // Fallback: derive from first message sent by someone else
    useEffect(() => {
        if (recipientUser || messages.length === 0) return;

        const otherMsg = messages.find((m) => {
            const sender = m.senderId as unknown as {
                _id: string;
                displayName: string;
                avatarUrl?: string;
            };
            return (
                sender &&
                typeof sender === "object" &&
                sender._id !== currentUserId
            );
        });

        if (otherMsg) {
            const sender = otherMsg.senderId as unknown as {
                _id: string;
                displayName: string;
                avatarUrl?: string;
            };
            setOtherUser({
                displayName: sender.displayName,
                avatarUrl: sender.avatarUrl,
            });
        }
    }, [messages, recipientUser, currentUserId]);

    return otherUser;
};
