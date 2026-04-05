
import { Permission } from "@/lib/types";

type NavigationItem = {
    title: string;
    icon: string;
    url: string;
    category?: string;
    roles?: string[]; // Keep for backward compatibility if needed, or deprecate
    permissions?: Permission[];
    target?: string;
    counterColor?: string;
    suffixIcon?: string;
    suffixIconViewBox?: string;
    suffixIconBg?: boolean;
    suffixText?: string;
    suffixUrl?: string;
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
        url: "/home",
        category: "Discover",
        permissions: ["explore:view"], // Or feed:view? Using explore:view based on previous analysis
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
        permissions: ["explore:view"],
    },

    // Shared Pages
    {
        title: "Notifications",
        icon: "notification",
        url: "/notifications",
        category: "General",
        counterColor: "#AE7AFF",
        // No restriction implies everyone, or we can add explicit common permission
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
