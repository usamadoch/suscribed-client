
import { useMemo } from 'react';
import { navigation, NavigationItem } from '@/constants/navigation';
import { useAuth } from '@/store/auth';
import { hasPermission } from '@/constants/permissions';

import { Permission } from '@/lib/types';
import { useMyPage } from '@/hooks/useQueries';

export type { NavigationItem } from '@/constants/navigation';

export const useNavigation = () => {
    const { user, isAuthenticated } = useAuth();

    // Fetch user's page data using cached query
    const { data: myPage } = useMyPage();

    // Determine the correct slug: prefer server page slug, fallback to username
    const pageSlug = myPage?.pageSlug || user?.username || null;

    // Compute Final Navigation
    const navItems = useMemo(() => {

        if (!isAuthenticated || !user?.role) {
            return navigation
                .filter((link) => {
                    if (link.permissions) return false;
                    return true;
                })
                .map((link) => ({ ...link }));
        }
        const filteredNav = navigation.filter((link) => {
            if (link.roles && !link.roles.includes(user.role)) return false;

            if (link.permissions) {
                return link.permissions.some(permission => hasPermission(user.role, permission));
            }
            if (link.isPublicRoute) return true;
            return true;
        });

        let newNav = [...filteredNav];

        if (hasPermission(user.role, 'page:manage') && pageSlug) {
            const dashboardIndex = newNav.findIndex(item => item.url === '/dashboard');

            if (dashboardIndex !== -1) {
                const yourPageLink: NavigationItem = {
                    title: "Your Page",
                    icon: "profile", // Ensure this icon exists in your Icon component
                    url: `/${pageSlug}`,
                    category: "Creator",
                    target: "_blank",
                    suffixIcon: "new-window",
                    suffixIconViewBox: "0 0 24 24"
                };

                // Insert after Dashboard
                newNav.splice(dashboardIndex + 1, 0, yourPageLink);
            }
        }

        // Add suffix to posts
        const postsIndex = newNav.findIndex(item => item.url === '/posts');
        if (postsIndex !== -1) {
            newNav[postsIndex] = {
                ...newNav[postsIndex],
                suffixIcon: "plus",
                suffixIconBg: true,
                suffixText: "Create Post",
                suffixUrl: "/posts/new"
            };
        }

        return newNav;
    }, [user?.role, isAuthenticated, pageSlug]);

    return navItems;
};
