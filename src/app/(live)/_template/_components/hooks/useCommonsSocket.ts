import { useEffect, RefObject } from 'react';
import { CommonsMessage } from './liveTypes';

export function useCommonsSocket(
    socket: any,
    isConnected: boolean,
    sessionId: string | undefined,
    enabled: boolean,
    onChatMsgRef: RefObject<((message: CommonsMessage) => void) | undefined>
) {
    useEffect(() => {
        if (!socket || !isConnected || !sessionId || !enabled) return;

        const handleChatMsg = ({ message }: { message: CommonsMessage }) => {
            onChatMsgRef.current?.(message);
        };

        socket.on('chat_message.new', handleChatMsg);
        return () => {
            socket.off('chat_message.new', handleChatMsg);
        };
    }, [socket, isConnected, sessionId, enabled, onChatMsgRef]);
}
