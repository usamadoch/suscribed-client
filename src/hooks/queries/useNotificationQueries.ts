import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/store/auth";

// Hook to fetch Notifications
export const useNotifications = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['notifications', user?._id],
        queryFn: async () => {
            return await notificationService.getAll();
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 1,
        refetchInterval: 1000 * 60 * 2,
    });
};

// Hook to mark all notifications as read
export const useMarkNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return await notificationService.markAllAsRead();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
