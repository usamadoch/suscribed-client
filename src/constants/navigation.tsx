import { Permission } from "@/types";
import { LucideIcon } from "lucide-react";
import { 
    LayoutDashboard, 
    Home, 
    FileText, 
    Users, 
    CreditCard, 
    Search, 
    Bell, 
    MessageCircle, 
    BarChart2, 
    Settings 
} from "@/lib/icons";

export type NavigationItem = {
    title: string;
    icon: LucideIcon | string;
    url: string;
    category?: string;
    roles?: string[]; // Keep for backward compatibility if needed, or deprecate
    permissions?: Permission[];
    target?: string;
    counter?: number;
    counterColor?: string;
    suffixIcon?: LucideIcon | string;
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
        icon: LayoutDashboard,
        url: "/dashboard",
        category: "Creator",
        permissions: ["dashboard:view"],
    },
    {
        title: "Home",
        icon: Home,
        url: "/",
        category: "Discover",
        isPublicRoute: true,
        roles: ["member", "admin"],
    },
    {
        title: "Posts",
        icon: FileText,
        url: "/posts",
        category: "Creator",
        permissions: ["post:create"], // Only creators see "Posts" management
    },
    {
        title: "Members",
        icon: Users,
        url: "/members",
        category: "Creator",
        permissions: ["members:view"],
    },
    {
        title: "Earnings",
        icon: CreditCard,
        url: "/earnings",
        category: "Creator",
        permissions: ["payouts:view"],
    },
    // Member Pages
    {
        title: "Explore",
        icon: Search,
        url: "/explore",
        category: "Discover",
        isPublicRoute: true,
        roles: ["member", "admin"],
    },

    // Shared Pages
    {
        title: "Notifications",
        icon: Bell,
        url: "/notifications",
        category: "General",
        counterColor: "#AE7AFF",
    },
    {
        title: "Messages",
        icon: MessageCircle,
        category: "General",
        counterColor: "#98E9AB",
        url: "/messages",
    },
    {
        title: "Analytics",
        icon: BarChart2,
        url: "/analytics",
        category: "Creator",
        permissions: ["analytics:view"],
    },
    {
        title: "Settings",
        icon: Settings,
        category: "General",
        url: "/settings",
    },
];
