import { useState } from "react";

import Comment from "@/components/Comment";

import { useAuth } from "@/store/auth";
import { useMyPage } from "@/hooks/queries";

import { ChatProps } from "./types";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatScroll } from "./hooks/useChatScroll";
import { useChatSocket } from "./hooks/useChatSocket";
import { useOtherUser } from "./hooks/useOtherUser";
import { useSendMessage } from "./hooks/useSendMessage";

import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatSkeleton from "./components/ChatSkeleton";

const Chat = ({
    visible,
    onClose,
    activeId,
    recipientUser,
    setActiveId,
    onMessageSent,
    recipientId,
}: ChatProps) => {
    const { user } = useAuth();
    const { data: page } = useMyPage();
    const [isTyping, setIsTyping] = useState(false);

    const conversationId = activeId;

    // ── Data ──
    const {
        messages,
        messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isPending,
    } = useChatMessages(conversationId);

    // ── Scroll ──
    const {
        containerRef,
        setShouldAutoScroll,
        handleScroll,
    } = useChatScroll({
        messages,
        messagesData,
        isLoading,
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage,
        fetchNextPage,
    });

    // ── Socket ──
    useChatSocket({
        conversationId,
        currentUserId: user?._id,
        setIsTyping,
    });

    // ── Other user resolution ──
    const otherUser = useOtherUser(messages, recipientUser, user?._id);

    // ── Send message ──
    const { value, setValue, handleSend } = useSendMessage({
        conversationId,
        currentUserId: user?._id,
        recipientUser,
        setActiveId,
        onMessageSent,
        setShouldAutoScroll,
    });

    // ── Loading state ──
    if (isLoading || (isPending && !recipientId)) {
        return <ChatSkeleton visible={visible} />;
    }

    return (
        <div
            className={`flex flex-col grow lg:fixed lg:inset-0 lg:z-100 lg:bg-white lg:transition-opacity dark:bg-n-1 ${visible
                    ? "lg:visible lg:opacity-100"
                    : "lg:invisible lg:opacity-0"
                }`}
        >
            <ChatHeader
                visible={visible}
                onClose={onClose}
                otherUser={otherUser}
            />

            <ChatMessageList
                messages={messages}
                user={user}
                page={page}
                otherUser={otherUser}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
                isTyping={isTyping}
                containerRef={containerRef}
                onScroll={handleScroll}
            />

            <Comment
                className="m-5"
                avatar={
                    (user?.role === "creator"
                        ? page?.avatarUrl
                        : user?.avatarUrl) || ""
                }
                placeholder="Type to add something"
                value={value}
                setValue={(e: any) => setValue(e.target.value)}
                onSend={handleSend}
            />
        </div>
    );
};

export default Chat;