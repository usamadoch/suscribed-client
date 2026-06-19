import { useEffect, RefObject } from 'react';
import { YouTubeMessage } from './liveTypes';

export function useYouTubeSocket(
    socket: any,
    isConnected: boolean,
    sessionId: string | undefined,
    enabled: boolean,
    onYTRef: RefObject<((messages: YouTubeMessage[]) => void) | undefined>
) {
    useEffect(() => {
        if (!socket || !isConnected || !sessionId || !enabled) return;

        const handleYT = ({ messages }: { messages: YouTubeMessage[] }) => {
            onYTRef.current?.(messages);
        };

        socket.on('youtube_message.new', handleYT);
        return () => {
            socket.off('youtube_message.new', handleYT);
        };
    }, [socket, isConnected, sessionId, enabled, onYTRef]);
}
