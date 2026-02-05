
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { postApi, membershipApi, notificationApi } from "@/lib/api";
import { useAuth } from "@/app/(auth)/_store/auth";

// Note: Page-related queries have been moved to: client/src/app/[page-slug]/_queries.ts
// - useCreatorPage
// - useMyPage
// - useExploreCreators
// - useMyMembers
// - useJoinPage
// - useCheckMembership

// Hook to fetch Creator Posts
// export const useCreatorPosts = (slug: string) => {
//     const { user } = useAuth();
//     return useQuery({
//         queryKey: ['creator-posts', slug, user?._id],
//         queryFn: async () => {
//             if (!slug) return [];
//             const { posts } = await postApi.getAll({ pageSlug: slug, limit: 100 });
//             return posts;
//         },
//         enabled: !!slug,
//         staleTime: 1000 * 60 * 2, // 2 minutes cache for posts
//     });
// };

// // Hook for User Memberships (List of pages I joined)
// export const useMyMemberships = (enabled: boolean = true) => {
//     const { user } = useAuth();
//     return useQuery({
//         queryKey: ['my-memberships', user?._id],
//         queryFn: async () => {
//             const { memberships } = await membershipApi.getMyMemberships({ limit: 100 });
//             return memberships || [];
//         },
//         enabled: !!user && enabled,
//         staleTime: 1000 * 60 * 15, // 15 minutes
//     });
// };

// // Hook to fetch Posts (Paginated)
// export const usePosts = (params: { page: number; limit: number }) => {
//     return useQuery({
//         queryKey: ['posts', params],
//         queryFn: async () => {
//             return await postApi.getAll(params);
//         },
//         staleTime: 1000 * 60 * 1, // 1 minute
//         placeholderData: keepPreviousData,
//     });
// };

// // Hook to fetch a single Post
// export const usePost = (id: string) => {
//     return useQuery({
//         queryKey: ['post', id],
//         queryFn: async () => {
//             if (!id) return null;
//             const data = await postApi.getById(id);
//             return data.post;
//         },
//         enabled: !!id,
//         staleTime: 1000 * 60 * 5, // 5 minutes
//     });
// };

// // Hook to fetch Post Comments
// export const usePostComments = (postId: string) => {
//     return useQuery({
//         queryKey: ['post-comments', postId],
//         queryFn: async () => {
//             if (!postId) return [];
//             const data = await postApi.getComments(postId, { limit: 100 });
//             return data.comments;
//         },
//         enabled: !!postId,
//         staleTime: 1000 * 60 * 1, // 1 minute
//     });
// };

// // Hook to delete a Post
// export const useDeletePost = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (postId: string) => {
//             return await postApi.delete(postId);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['posts'] });
//             queryClient.invalidateQueries({ queryKey: ['creator-posts'] });
//         },
//     });
// };

// // Hook to fetch Notifications
// export const useNotifications = () => {
//     const { user } = useAuth();
//     return useQuery({
//         queryKey: ['notifications', user?._id],
//         queryFn: async () => {
//             return await notificationApi.getAll();
//         },
//         enabled: !!user,
//         staleTime: 1000 * 60 * 1, // 1 minute
//         refetchInterval: 1000 * 60 * 2, // Auto refetch every 2 minutes
//     });
// };

// // Hook to mark all notifications as read
// export const useMarkNotificationsAsRead = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async () => {
//             return await notificationApi.markAllAsRead();
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['notifications'] });
//         },
//     });
// };
