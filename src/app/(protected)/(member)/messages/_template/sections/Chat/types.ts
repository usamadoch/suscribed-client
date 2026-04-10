import { Message, User } from "@/types";

/**
 * Props for the Chat component.
 *
 * Type guide rules applied:
 * - `activeId` was `any` → now `string | null` (the domain uses string IDs or null for "none")
 * - `visible` was optional → required (always passed by parent)
 * - `onClose` was optional → required (always passed by parent)
 * - `recipientUser` was `User | null` with `?` → required with `| null` (the parent always provides the value)
 * - `setActiveId` was optional → required (always wired up)
 * - `onMessageSent` was optional → required (always wired up)
 * - `recipientId` stays `string | null` (absent when no "?to=" search param)
 */
export type ChatProps = {
    visible: boolean;
    onClose: () => void;
    activeId: string | null;
    recipientUser: User | null;
    setActiveId: (id: string) => void;
    onMessageSent: (message: Message) => void;
    recipientId: string | null;
};
