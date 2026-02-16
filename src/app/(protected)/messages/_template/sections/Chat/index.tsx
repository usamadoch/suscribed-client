import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Comment from "@/components/Comment";

import Answer from "./Answer";
import Question from "./Question";
import { conversationApi, ApiClientError } from '@/lib/api';
import { Message, User } from "@/lib/types";
import { formatAppDate } from "@/lib/date";

import { useAuth } from "@/store/auth";
import { useSocket } from "@/store/socket";
import Loader from "@/components/Loader";


type MessagesProps = {
    visible?: boolean;
    onClose?: () => void;
    activeId?: any;
    recipientUser?: User | null;
    setActiveId?: (id: string) => void;
    onMessageSent?: (message: Message) => void;
};

const Chat = ({ visible, onClose, activeId, recipientUser, setActiveId, onMessageSent }: MessagesProps) => {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();
    const [value, setValue] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [otherUser, setOtherUser] = useState<{ displayName: string; avatarUrl?: string } | null>(null);
    const queryClient = useQueryClient();

    const conversationId = activeId;

    const {
        data: messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isPending
    } = useInfiniteQuery({
        queryKey: ['messages', conversationId],
        queryFn: async ({ pageParam }) => {
            const { messages, pagination } = await conversationApi.getMessages(conversationId, {
                cursor: pageParam as string | undefined, // undefined for first page
                limit: 10
            });
            // The API returns messages sorted Newest -> Oldest (suitable for pagination)
            // We want to return them as is, and reverse them for display.
            return {
                messages,
                nextCursor: pagination.cursor
            };
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!conversationId && conversationId !== 'new',
        staleTime: Infinity, // Rely on socket/mutation updates
    });

    // Flatten messages from all pages and reverse for display (Oldest -> Newest)
    const messages = useMemo(() => {
        if (!messagesData) return [];
        // Flatten: [[Newest...Older], [Older...Oldest], ...] -> [Newest...Oldest]
        const allMessages = messagesData.pages.flatMap(page => page.messages);
        // Reverse for display: [Oldest...Newest]
        return [...allMessages].reverse();
    }, [messagesData]);


    // Scroll Management
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const prevScrollHeightRef = useRef<number>(0);

    // Initial load: Scroll to bottom instantly
    useEffect(() => {
        if (!isLoading && messages.length > 0 && !messagesData?.pages[1]) {
            scrollToBottom(false);
        }
    }, [isLoading, messages.length === 0]); // Trigger on initial load completion

    // Handle Scroll for Pagination
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        // Detect "Scroll to Top" (with buffer)
        if (scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
            prevScrollHeightRef.current = scrollHeight;
            fetchNextPage();
        }

        // Detect "Scroll to Bottom" logic
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldAutoScroll(isNearBottom);
    };

    // Maintain scroll position after fetchNextPage
    useEffect(() => {
        if (prevScrollHeightRef.current > 0 && containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;
            if (diff > 0) {
                containerRef.current.scrollTop = diff;
                prevScrollHeightRef.current = 0;
            }
        }
    }, [messagesData?.pages.length]); // Trigger when a new page is added

    // Auto-scroll on new message if near bottom
    useEffect(() => {
        if (shouldAutoScroll && messages.length > 0) {
            scrollToBottom(true);
        }
    }, [messages.length, shouldAutoScroll]);


    useEffect(() => {
        if (messages.length > 0) {
            // Updated extraction logic
            if (!recipientUser) {
                // Find first message from another user
                const otherMsg = messages.find(m => {
                    const sender = m.senderId as unknown as { _id: string; displayName: string; avatarUrl?: string };
                    return sender && typeof sender === 'object' && sender._id !== user?._id;
                });

                if (otherMsg) {
                    const sender = otherMsg.senderId as unknown as { _id: string; displayName: string; avatarUrl?: string };
                    setOtherUser({ displayName: sender.displayName, avatarUrl: sender.avatarUrl });
                }
            }
        }
    }, [messages, recipientUser, user?._id]);

    useEffect(() => {
        if (recipientUser) {
            setOtherUser({ displayName: recipientUser.displayName, avatarUrl: recipientUser.avatarUrl || undefined });
        }
    }, [recipientUser]);

    // Join conversation room for real-time messages
    useEffect(() => {
        if (!socket || !isConnected || !conversationId || conversationId === 'new') return;

        // Join the conversation room
        socket.emit('join_room', { conversationId });

        // Listen for new messages from OTHER users only
        const handleNewMessage = (message: Message) => {
            const senderId = typeof message.senderId === 'string'
                ? message.senderId
                : (message.senderId as any)._id;

            // Skip if this is our own message (we already added it via API response / optimistic)
            if (senderId === user?._id) return;

            queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
                if (!oldData) return { pages: [{ messages: [message], nextCursor: null }], pageParams: [undefined] };

                // Add to the FIRST page (Newest messages page)
                const newPages = [...oldData.pages];
                const firstPage = { ...newPages[0] };

                // Check duplicate
                if (firstPage.messages.some((m: Message) => m._id === message._id)) return oldData;

                firstPage.messages = [message, ...firstPage.messages]; // Prepend (Newest First)
                newPages[0] = firstPage;

                return {
                    ...oldData,
                    pages: newPages
                };
            });
            // Auto-scroll handled by useEffect dependent on shouldAutoScroll
        };

        socket.on('new_message', handleNewMessage);

        // Listen for typing indicator
        const handleTyping = ({ userId }: { userId: string; conversationId: string }) => {
            if (userId !== user?._id) {
                setIsTyping(true);
            }
        };

        const handleStopTyping = ({ userId }: { userId: string }) => {
            if (userId !== user?._id) {
                setIsTyping(false);
            }
        };

        socket.on('user_typing', handleTyping);
        socket.on('user_stopped_typing', handleStopTyping);

        // Listen for message read status
        const handleMessageRead = ({ messageId }: { messageId: string }) => {
            queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
                if (!oldData) return oldData;

                // Need to find and update across all pages
                const newPages = oldData.pages.map((page: any) => ({
                    ...page,
                    messages: page.messages.map((m: Message) =>
                        m._id === messageId ? { ...m, isRead: true } : m
                    )
                }));

                return { ...oldData, pages: newPages };
            });
        };

        socket.on('message_read', handleMessageRead);

        return () => {
            // Leave room and remove listeners on cleanup
            socket.emit('leave_room', { conversationId });
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleTyping);
            socket.off('user_stopped_typing', handleStopTyping);
            socket.off('message_read', handleMessageRead);
        };
    }, [socket, isConnected, conversationId, user?._id, queryClient]);


    const scrollToBottom = (smooth = true) => {
        // Use containerRef instead of messagesEndRef for robustness
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
            }
        }, 50);
    };

    const { setActiveConversationId } = useSocket();

    useEffect(() => {
        if (conversationId && conversationId !== 'new') {
            setActiveConversationId(conversationId);
        }
        return () => setActiveConversationId(null);
    }, [conversationId, setActiveConversationId]);

    const handleSend = async () => {
        if (!value.trim() || !conversationId) return;

        try {
            let currentConversationId = conversationId;
            if (currentConversationId === 'new' && recipientUser) {
                // Create conversation first
                const { conversation } = await conversationApi.start({ recipientId: recipientUser._id });
                currentConversationId = conversation._id;
                if (setActiveId) setActiveId(currentConversationId); // Update parent
            }

            const tempId = `temp-${Date.now()}`;
            // Use Omit to avoid conflict with Message status type
            const tempMessage: Omit<Message, 'status'> & { status: 'sending' } = {
                _id: tempId,
                conversationId: currentConversationId,
                senderId: user?._id || '',
                content: value,
                contentType: 'text',
                attachments: [],
                status: 'sending', // Local status
                isRead: false,
                readAt: null,
                createdAt: new Date().toISOString(),
            };

            // Optimistically update
            queryClient.setQueryData(['messages', currentConversationId], (oldData: any) => {
                // Return structure for InfiniteQuery
                if (!oldData) {
                    return {
                        pages: [{ messages: [tempMessage], nextCursor: null }],
                        pageParams: [undefined]
                    };
                }

                const newPages = [...oldData.pages];
                const firstPage = { ...newPages[0] };
                firstPage.messages = [tempMessage, ...firstPage.messages];
                newPages[0] = firstPage;

                return { ...oldData, pages: newPages };
            });

            setValue("");
            setShouldAutoScroll(true); // Force scroll on send
            // scroll effect will trigger

            const { message } = await conversationApi.sendMessage(currentConversationId, { content: value });

            // Replace temporary message with real one
            queryClient.setQueryData(['messages', currentConversationId], (oldData: any) => {
                if (!oldData) return oldData;

                const newPages = oldData.pages.map((page: any) => ({
                    ...page,
                    messages: page.messages.map((m: Message) => m._id === tempId ? message : m)
                }));

                return { ...oldData, pages: newPages };
            });

            if (onMessageSent) onMessageSent(message);
        } catch (e) {
            console.error(e);
            // Revert on error? Or show error state on message
        }
    };

    const formatTime = (date?: string) => {
        if (!date) return "";
        return formatAppDate(date, { chatFormat: true });
    };

    if (isLoading || isPending) {

        return (
            <div
                className={`flex flex-col grow lg:fixed lg:inset-0 lg:z-100 lg:bg-white lg:transition-opacity dark:bg-n-1 ${visible
                    ? "lg:visible lg:opacity-100"
                    : "lg:invisible lg:opacity-0"
                    }`}
            >
                <div className="flex mb-5 p-5 border-b border-n-1 dark:border-white">
                    <div className="btn-stroke btn-square btn-small hidden mr-2 lg:block animate-skeleton bg-n-4/10" />


                    <div className="flex items-center mx-auto pl-12 pr-2 text-sm font-bold lg:px-3">

                        <div className="w-6 h-6 border mr-2 border-n-1 rounded-full animate-skeleton bg-n-4/10" />
                        <div className="w-20 h-4 border border-n-1 animate-skeleton bg-n-4/10" />
                    </div>

                    <div className="btn-stroke btn-square btn-small animate-skeleton bg-n-4/10" />
                </div>
                <div className="grow px-5 space-y-4 overflow-auto" />

            </div>

        )
    }

    return (
        <div
            className={`flex flex-col grow lg:fixed lg:inset-0 lg:z-100 lg:bg-white lg:transition-opacity dark:bg-n-1 ${visible
                ? "lg:visible lg:opacity-100"
                : "lg:invisible lg:opacity-0"
                }`}
        >
            <div className="flex mb-5 p-5 border-b border-n-1 dark:border-white">
                <button
                    className="btn-stroke btn-square btn-small hidden mr-2 lg:block"
                    onClick={onClose}
                >
                    <Icon name="close" />
                </button>


                <div className="flex items-center mx-auto pl-12 pr-2 text-sm font-bold lg:px-3">
                    {otherUser && (
                        <>
                            <div className="relative w-6 h-6 mr-2">
                                <Image
                                    className="object-cover rounded-full"
                                    src={otherUser.avatarUrl || "/images/avatars/avatar.jpg"}
                                    fill
                                    alt="Avatar"
                                />
                            </div>
                            {otherUser.displayName}
                        </>
                    )}
                </div>

                <button className="btn-stroke btn-square btn-small">
                    <Icon name="dots" />
                </button>
            </div>
            <div className="relative grow flex flex-col min-h-0">
                {hasNextPage && isFetchingNextPage && (
                    <div className="absolute top-2 left-0 w-full flex justify-center z-10 pointer-events-none">

                        <Loader text="Loading..." />
                    </div>
                )}
                <div
                    className="grow px-5 space-y-4 overflow-auto"
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {messages.map((msg) => {
                        const isMe = (typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id) === user?._id;
                        const sender = typeof msg.senderId === 'object' ? msg.senderId : { displayName: 'User', avatarUrl: '' };

                        if (isMe) {
                            return (
                                <Answer
                                    key={msg._id}
                                    time={formatTime(msg.createdAt)}
                                    content={msg.content}
                                    author={{ name: "You", avatar: user?.avatarUrl || "/images/avatars/avatar.jpg" }}
                                    status={(msg as any).status}
                                />
                            );
                        } else {
                            return (
                                <Question
                                    key={msg._id}
                                    time={formatTime(msg.createdAt)}
                                    content={msg.content}
                                    author={{ name: sender.displayName || otherUser?.displayName || "User", avatar: sender.avatarUrl || otherUser?.avatarUrl || "/images/avatars/avatar.jpg" }}
                                />
                            );
                        }
                    })}
                    {isTyping && <div className="text-xs text-n-3 ml-12">Typing...</div>}
                </div>
            </div>

            <Comment
                className="m-5"
                avatar={user?.avatarUrl || "/images/avatars/avatar.jpg"}
                placeholder="Type to add something"
                value={value}
                setValue={(e: any) => setValue(e.target.value)}
                onSend={handleSend} // Assuming Comment supports onSend or we need to wrap it
            />

        </div>

    );
};

export default Chat;
