import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useNavigation, NavigationItem } from "@/hooks/useNavigation";
import { useSocket } from "@/store/socket";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/modals/LoginModal";
import MenuItem from "./MenuItem";

type MenuProps = {
    visible?: boolean;
    isMinimize?: boolean;
};

const Menu = ({ visible, isMinimize }: MenuProps) => {
    const pathname = usePathname();
    const navigationItems = useNavigation();
    const { isAuthenticated } = useAuth();
    const { unreadCount, messageUnreadCount } = useSocket();

    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleNavClick = (e: React.MouseEvent, link: NavigationItem) => {
        if (!isAuthenticated && !link.isPublicRoute) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    const groupedNavigation = useMemo(() => {
        const grouped: Record<string, NavigationItem[]> = {};
        navigationItems.forEach((link) => {
            const cat = link.category || "Navigation";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(link);
        });
        return Object.entries(grouped);
    }, [navigationItems]);

    // Centralized configuration for dynamic counters
    const dynamicCounters: Record<string, number> = {
        "/notifications": unreadCount,
        "/messages": messageUnreadCount,
    };

    return (
        <>
            <div className={`mb-10 ${visible ? "-mx-4" : isMinimize ? "mx-0" : "-mx-4 xl:mx-0"}`}>
                {groupedNavigation.map(([category, links], catIndex) => (
                    <div key={catIndex} className="mb-6 last:mb-0">
                        <div
                            className={`mb-3 px-4 uppercase overflow-hidden whitespace-nowrap text-[11px] font-medium text-n-7 ${
                                visible ? "w-full opacity-100" : isMinimize ? "text-0 opacity-0" : "xl:text-0 xl:opacity-0"
                            }`}
                        >
                            {category}
                        </div>
                        {links.map((link: NavigationItem, index: number) => {
                            const dynamicCount = dynamicCounters[link.url];
                            const isActive = pathname === link.url || (link.url !== "/" && pathname.startsWith(`${link.url}/`));

                            return (
                                <MenuItem
                                    key={index}
                                    link={link}
                                    isActive={isActive}
                                    visible={visible}
                                    isMinimize={isMinimize}
                                    dynamicCount={dynamicCount}
                                    isAuthenticated={isAuthenticated}
                                    onNavClick={handleNavClick}
                                    onShowLoginModal={() => setShowLoginModal(true)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            <LoginModal
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Menu;
