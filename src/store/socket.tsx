'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { useAuth } from './auth';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/lib/types';
import { notificationApi, conversationApi } from '@/lib/api';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    messageUnreadCount: number;
    activeConversationId: string | null;
    isOnMessagesPage: boolean;
    // Actions
    setSocket: (socket: Socket | null) => void;
    setIsConnected: (connected: boolean) => void;
    setActiveConversationId: (id: string | null) => void;
    setIsOnMessagesPage: (isOn: boolean) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsReadLocal: () => void;
    clearNotifications: () => void;
    setNotifications: (notifications: Notification[]) => void;
    setUnreadCount: (count: number) => void;
    setMessageUnreadCount: (count: number) => void;
    incrementMessageUnreadCount: () => void;
    resetMessageUnreadCount: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    socket: null,
    isConnected: false,
    notifications: [],
    unreadCount: 0,
    messageUnreadCount: 0,
    activeConversationId: null,
    isOnMessagesPage: false,
    setSocket: (socket) => set({ socket }),
    setIsConnected: (isConnected) => set({ isConnected }),
    setActiveConversationId: (id) => set({ activeConversationId: id }),
    setIsOnMessagesPage: (isOnMessagesPage) => set({ isOnMessagesPage }),
    addNotification: (notification) => set((state) => {
        // Skip message notifications - we use messageUnreadCount for those
        if (notification.type === 'new_message') {
            return { notifications: state.notifications, unreadCount: state.unreadCount };
        }

        const existingIndex = state.notifications.findIndex(n => n._id === notification._id);

        if (existingIndex !== -1) {
            const updatedNotifications = [...state.notifications];
            updatedNotifications[existingIndex] = notification;
            updatedNotifications.splice(existingIndex, 1);
            updatedNotifications.unshift(notification);

            return {
                notifications: updatedNotifications,
                unreadCount: state.unreadCount
            };
        }

        return {
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        };
    }),
    markAsRead: (id) => set((state) => {
        const wasUnread = state.notifications.find(n => n._id === id && !n.isRead);
        return {
            notifications: state.notifications.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
    }),
    markAllAsReadLocal: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
    })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    setNotifications: (notifications) => set({ notifications }),
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    setMessageUnreadCount: (messageUnreadCount) => set({ messageUnreadCount }),
    incrementMessageUnreadCount: () => set((state) => ({
        messageUnreadCount: state.messageUnreadCount + 1
    })),
    resetMessageUnreadCount: () => set({ messageUnreadCount: 0 }),
}));

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuth() as any;
    const {
        setSocket,
        setIsConnected,
        addNotification,
        setUnreadCount,
        setMessageUnreadCount,
        socket: currentSocket,
    } = useSocketStore();

    useEffect(() => {
        // If not authenticated, ensure socket is disconnected
        if (!isAuthenticated || !user) {
            if (currentSocket) {
                currentSocket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Initialize new connection
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            auth: {
                userId: user._id,
            },
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);

            // Fetch initial notification unread count
            notificationApi.getUnreadCount()
                .then(res => setUnreadCount(res.count))
                .catch(err => console.error('Failed to fetch notification unread count', err));

            // Fetch initial message unread count
            conversationApi.getUnreadCount()
                .then(res => setMessageUnreadCount(res.count))
                .catch(err => console.error('Failed to fetch message unread count', err));
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Handle general notifications (excluding messages)
        newSocket.on('notification', (notification: Notification) => {
            // Skip message notifications - those are handled separately
            if (notification.type === 'new_message') {
                return;
            }

            addNotification(notification);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        // Handle new message notifications for sidebar badge
        newSocket.on('new_message_notification', ({ conversationId }: { conversationId: string; message: any }) => {
            const state = useSocketStore.getState();

            // Don't increment if user is on the messages page
            if (state.isOnMessagesPage) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                return;
            }

            // Increment unread count for sidebar badge
            useSocketStore.getState().incrementMessageUnreadCount();

            // Invalidate conversations query to update last message preview
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });

        newSocket.on('connect_error', (error: any) => {
            console.error('Socket connection error:', error.message);
        });

        setSocket(newSocket);

        // Cleanup on unmount or dependency change
        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, user?._id]);

    return <>{children}</>;
}

export function useSocket() {
    return useSocketStore();
}
