import { useQuery } from "@tanstack/react-query";
import { membershipApi } from "./_api";
import { useAuth } from "@/app/(auth)/_store/auth";








// Hook for User Memberships (List of pages I joined)
export const useMyMemberships = (enabled: boolean = true) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['my-memberships', user?._id],
        queryFn: async () => {
            const { memberships } = await membershipApi.getMyMemberships({ limit: 100 });
            return memberships || [];
        },
        enabled: !!user && enabled,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });
};