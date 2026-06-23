import { useEffect, useRef } from 'react';
import { useSocketStore } from '@/store/socket';
import { YouTubeMessage, CommonsMessage, LiveMessage } from './liveTypes';
import { useYouTubeSocket } from './useYouTubeSocket';
import { useCommonsSocket } from './useCommonsSocket';

export type { YouTubeMessage, CommonsMessage, LiveMessage };

interface UseLiveSocketOptions {
    sessionId: string | undefined;
    enabled?: boolean;
    onYouTubeMessages?: (messages: YouTubeMessage[]) => void;
    onChatHistory?: (messages: LiveMessage[]) => void;
    onChatMessage?: (message: CommonsMessage) => void;
    onSessionEnded?: () => void;
    onMessageRemoved?: (messageId: string) => void;
    onUserMuted?: (data: { userId: string, mutedUntil: string }) => void;
}

export function useLiveSocket({
    sessionId,
    enabled = true,
    onYouTubeMessages,
    onChatHistory,
    onChatMessage,
    onSessionEnded,
    onMessageRemoved,
    onUserMuted,
}: UseLiveSocketOptions) {
    const socket = useSocketStore((s) => s.socket);
    const isConnected = useSocketStore((s) => s.isConnected);
    const joinedRef = useRef<string | null>(null);

    const onYTRef = useRef(onYouTubeMessages);
    onYTRef.current = onYouTubeMessages;

    const onHistoryRef = useRef(onChatHistory);
    onHistoryRef.current = onChatHistory;

    const onChatMsgRef = useRef(onChatMessage);
    onChatMsgRef.current = onChatMessage;

    const onEndedRef = useRef(onSessionEnded);
    onEndedRef.current = onSessionEnded;

    const onRemovedRef = useRef(onMessageRemoved);
    onRemovedRef.current = onMessageRemoved;

    const onMutedRef = useRef(onUserMuted);
    onMutedRef.current = onUserMuted;

    // Join / leave room
    useEffect(() => {
        if (!socket || !isConnected || !sessionId || !enabled) return;

        socket.emit('join_session', { sessionId });
        joinedRef.current = sessionId;

        return () => {
            socket.emit('leave_session', { sessionId });
            joinedRef.current = null;
        };
    }, [socket, isConnected, sessionId, enabled]);

    // Listen for chat history (sent once on join)
    useEffect(() => {
        if (!socket || !isConnected || !sessionId || !enabled) return;

        const handleHistory = ({ messages }: { messages: LiveMessage[] }) => {
            onHistoryRef.current?.(messages);
        };

        socket.on('chat.history', handleHistory);
        return () => {
            socket.off('chat.history', handleHistory);
        };
    }, [socket, isConnected, sessionId, enabled]);

    useYouTubeSocket(socket, isConnected, sessionId, enabled, onYTRef);
    useCommonsSocket(socket, isConnected, sessionId, enabled, onChatMsgRef);

    // Listen for session ended
    useEffect(() => {
        if (!socket || !isConnected || !sessionId) return;

        const handleEnded = () => {
            onEndedRef.current?.();
        };

        socket.on('session.ended', handleEnded);
        socket.on('chat_message.removed', (data: { messageId: string }) => {
            onRemovedRef.current?.(data.messageId);
        });
        socket.on('chat.user_muted', (data: { userId: string, mutedUntil: string }) => {
            onMutedRef.current?.(data);
        });

        return () => {
            socket.off('session.ended', handleEnded);
            socket.off('chat_message.removed');
            socket.off('chat.user_muted');
        };
    }, [socket, isConnected, sessionId]);
}
