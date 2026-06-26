import { useMemo } from 'react';
import { navigation, NavigationItem } from '@/constants/navigation';
import { useAuth } from '@/store/auth';
import { hasPermission } from '@/constants/permissions';
import { User, ExternalLink } from '@/lib/icons';
import { UserRole } from '@/types';

import { useMyPage } from '@/hooks/queries';

export type { NavigationItem } from '@/constants/navigation';

// Helper: Filter navigation for unauthenticated users
const getUnauthenticatedNav = (): NavigationItem[] => {
    return navigation
        .filter((link) => !link.permissions)
        .map((link) => ({ ...link }));
};

// Helper: Filter navigation for authenticated users
const getAuthenticatedNav = (role: UserRole): NavigationItem[] => {
    return navigation.filter((link) => {
        if (link.roles && !link.roles.includes(role)) return false;
        if (link.permissions) {
            return link.permissions.some(permission => hasPermission(role, permission));
        }
        return true;
    });
};

// Helper: Inject dynamic "Your Page" link
const injectYourPageLink = (navItems: NavigationItem[], pageSlug: string): NavigationItem[] => {
    const dashboardIndex = navItems.findIndex(item => item.url === '/dashboard');
    if (dashboardIndex === -1) return navItems;

    const newNav = [...navItems];
    const yourPageLink: NavigationItem = {
        title: "Your Page",
        icon: User,
        url: `/${pageSlug}`,
        category: "Creator",
        target: "_blank",
        suffixIcon: ExternalLink,
    };

    newNav.splice(dashboardIndex + 1, 0, yourPageLink);
    return newNav;
};

export const useNavigation = () => {
    const { user, isAuthenticated } = useAuth();
    const { data: myPage } = useMyPage();

    const pageSlug = myPage?.pageSlug || user?.username || null;

    const navItems = useMemo(() => {
        if (!isAuthenticated || !user?.role) {
            return getUnauthenticatedNav();
        }

        let filteredNav = getAuthenticatedNav(user.role);

        if (hasPermission(user.role, 'page:manage') && pageSlug) {
            filteredNav = injectYourPageLink(filteredNav, pageSlug);
        }

        return filteredNav;
    }, [user, isAuthenticated, pageSlug]);

    return navItems;
};
