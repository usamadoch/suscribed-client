import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { liveApi } from "@/services/live.service";

export const usePublicLiveSession = (idParam: string | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ["publicLiveSession", idParam],
        queryFn: () => liveApi.getPublicSession(idParam!),
        enabled,
        retry: false,
    });
};

export const useLiveSessions = () => {
    return useQuery({
        queryKey: ["liveSessions"],
        queryFn: () => liveApi.listSessions(),
    });
};

export const useDeleteLiveSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => liveApi.deleteSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveSessions"] });
        },
    });
};
