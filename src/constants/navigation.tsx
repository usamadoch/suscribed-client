
import { Permission } from "@/lib/types";

export type NavigationItem = {
    title: string;
    icon: string;
    url: string;
    category?: string;
    roles?: string[]; // Keep for backward compatibility if needed, or deprecate
    permissions?: Permission[];
    target?: string;
    counter?: number;
    counterColor?: string;
    suffixIcon?: string;
    suffixIconViewBox?: string;
    suffixIconBg?: boolean;
    suffixText?: string;
    suffixUrl?: string;
    /** If true, this route is accessible to guests without auth */
    isPublicRoute?: boolean;
};

export const navigation: NavigationItem[] = [
    // Creator Pages

    {
        title: "Dashboard",
        icon: "dashboard",
        url: "/dashboard",
        category: "Creator",
        permissions: ["dashboard:view"],
    },
    {
        title: "Home",
        icon: "dashboard",
        url: "/",
        category: "Discover",
        isPublicRoute: true,
        roles: ["member", "admin"],
    },
    {
        title: "Posts",
        icon: "document",


        url: "/posts",
        category: "Creator",
        permissions: ["post:create"], // Only creators see "Posts" management
    },
    {
        title: "Members",
        icon: "team",
        url: "/members",
        category: "Creator",
        permissions: ["members:view"],
    },
    {
        title: "Earnings",
        icon: "card",
        url: "/earnings",
        category: "Creator",
        permissions: ["payouts:view"],
    },
    // Member Pages
    {
        title: "Explore",
        icon: "search",
        url: "/explore",
        category: "Discover",
        isPublicRoute: true,
        roles: ["member", "admin"],
    },

    // Shared Pages
    {
        title: "Notifications",
        icon: "notification",
        url: "/notifications",
        category: "General",
        counterColor: "#AE7AFF",
    },
    {
        title: "Messages",
        icon: "messages",
        category: "General",
        counterColor: "#98E9AB",
        url: "/messages",
    },
    {
        title: "Analytics",
        icon: "chart",
        url: "/analytics",
        category: "Creator",
        permissions: ["analytics:view"],
    },
    {
        title: "Settings",
        icon: "setup",
        category: "General",
        url: "/settings",
    },
];

export const navigationMobile = [
    {
        icon: "dashboard",
        url: "/dashboard/ecommerce",
    },
    // {
    //     icon: "projects",
    //     url: "/projects/projects-list-v1",
    // },
    // {
    //     icon: "tasks",
    //     url: "/projects/tasks-list-v1",
    // },
    // {
    //     icon: "layers",
    //     url: "/projects/kanban-desc",
    // },
    {
        icon: "dots",
        onClick: () => console.log("Click on dots"),
    },
];
