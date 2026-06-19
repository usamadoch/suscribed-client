import { useQuery } from "@tanstack/react-query";
import { liveApi } from "@/services/live.service";

export const usePublicLiveSession = (idParam: string | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ["publicLiveSession", idParam],
        queryFn: () => liveApi.getPublicSession(idParam!),
        enabled,
        retry: false,
    });
};
