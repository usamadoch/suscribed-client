
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
        // ── GUEST MODE: Show member-level sidebar items ──
        // Guests see the same sidebar as members, but clicks on protected
        // items are intercepted by the Menu component to show LoginModal.
        if (!isAuthenticated || !user?.role) {
            return navigation
                .filter((link) => {
                    // Hide items that require creator/admin permissions
                    if (link.permissions) return false;
                    // Show public routes + shared routes (no permissions = member-level)
                    return true;
                })
                .map((link) => ({ ...link }));
        }

        // ── AUTHENTICATED MODE: Filter by permissions/roles as before ──
        const filteredNav = navigation.filter((link) => {
            // Public routes are always visible
            if (link.isPublicRoute) return true;
            // Check permissions first
            if (link.permissions) {
                return link.permissions.some(permission => hasPermission(user.role, permission));
            }
            // Fallback to roles
            if (link.roles) {
                return link.roles.includes(user.role);
            }
            return true;
        });

        let newNav = [...filteredNav];

        // Inject "Your Page" for creators (or those with page:manage)
        if (hasPermission(user.role, 'page:manage') && pageSlug) {
            // Find index of Dashboard to insert after
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
