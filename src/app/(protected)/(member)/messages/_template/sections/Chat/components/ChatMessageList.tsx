import { RefObject } from "react";
import { Message, AuthUser } from "@/types";
import { CreatorPage } from "@/types";
import { formatAppDate } from "@/lib/date";
import Loader from "@/components/Loader";
import Answer from "../Answer";
import Question from "../Question";

type ChatMessageListProps = {
    messages: Message[];
    user: AuthUser | null;
    page: CreatorPage | undefined;
    otherUser: { displayName: string; avatarUrl?: string } | null;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isTyping: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

const formatTime = (date?: string): string => {
    if (!date) return "";
    return formatAppDate(date, { chatFormat: true });
};

const ChatMessageList = ({
    messages,
    user,
    page,
    otherUser,
    hasNextPage,
    isFetchingNextPage,
    isTyping,
    containerRef,
    onScroll,
}: ChatMessageListProps) => (
    <div className="relative grow flex flex-col min-h-0">
        {hasNextPage && isFetchingNextPage && (
            <div className="absolute top-2 left-0 w-full flex justify-center z-10 pointer-events-none">
                <Loader text="Loading..." />
            </div>
        )}
        <div
            className="grow px-5 space-y-4 overflow-auto"
            ref={containerRef}
            onScroll={onScroll}
        >
            {messages.map((msg) => {
                const isMe =
                    (typeof msg.senderId === "string"
                        ? msg.senderId
                        : msg.senderId._id) === user?._id;
                const sender =
                    typeof msg.senderId === "object"
                        ? msg.senderId
                        : { displayName: "User", avatarUrl: "" };

                if (isMe) {
                    return (
                        <Answer
                            key={msg._id}
                            time={formatTime(msg.createdAt)}
                            content={msg.content}
                            author={{
                                name:
                                    (user?.role === "creator"
                                        ? page?.displayName
                                        : "You") || "You",
                                avatar:
                                    (user?.role === "creator"
                                        ? page?.avatarUrl
                                        : user?.avatarUrl) || "",
                            }}
                            status={(msg as any).status}
                        />
                    );
                } else {
                    return (
                        <Question
                            key={msg._id}
                            time={formatTime(msg.createdAt)}
                            content={msg.content}
                            author={{
                                name:
                                    sender.displayName ||
                                    otherUser?.displayName ||
                                    "User",
                                avatar:
                                    sender.avatarUrl ||
                                    otherUser?.avatarUrl ||
                                    "",
                            }}
                        />
                    );
                }
            })}
            {isTyping && (
                <div className="text-xs text-n-3 dark:text-n-8 ml-12">Typing...</div>
            )}
        </div>
    </div>
);

export default ChatMessageList;
