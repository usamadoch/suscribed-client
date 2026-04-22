import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";

import { navigation } from "@/constants/navigation";
import { useNavigation } from "@/hooks/useNavigation";
import ActionMenu from "@/components/ActionMenu";

import { useState } from "react";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/modals/LoginModal";

type MenuProps = {};

const Menu = ({ }: MenuProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const navigationItems = useNavigation();
    const { isAuthenticated } = useAuth();

    const [showLoginModal, setShowLoginModal] = useState(false);

    // Dynamic Mobile Layout: 
    // - Show first 3 authorized items directly
    // - Put everything else in the ActionMenu (making a total of 4 icons)
    const visibleItems = navigationItems.slice(0, 3);
    const hiddenItems = navigationItems.slice(3);

    const moreItems = hiddenItems.map((item) => ({
        label: item.title,
        icon: item.icon,
        onClick: (e: React.MouseEvent) => handleNavClick(e, item),
    }));

    const handleNavClick = (e: React.MouseEvent, link: any) => {
        if (!isAuthenticated && !link.isPublicRoute) {
            e.preventDefault();
            setShowLoginModal(true);
            return;
        }
        router.push(link.url);
    };

    return (
        <>
            <div className="fixed left-0 bottom-0 right-0 z-10 hidden justify-between items-center px-3 bg-background border-t border-n-1 mobile:flex dark:bg-n-2 dark:border-n-6">
                {visibleItems.map((link: any, index: number) => {
                    const isActive = pathname === link.url;
                    return (
                        <button
                            className="flex justify-center items-center w-12 h-18 tap-highlight-color"
                            onClick={(e) => handleNavClick(e, link)}
                            key={index}
                        >
                            <Icon
                                className={`icon-22 transition-colors dark:fill-n-9 ${isActive ? "text-purple-1!" : "text-n-7 dark:text-n-9"
                                    }`}
                                name={link.icon}
                            />
                        </button>
                    );
                })}
                {hiddenItems.length > 0 && (
                    <ActionMenu
                        items={moreItems}
                        buttonClass="flex justify-center items-center w-12 h-18 tap-highlight-color"
                        iconName="dots"
                        iconClass={`icon-22 transition-colors dark:fill-n-9 ${hiddenItems.some(item => pathname === item.url) ? "text-purple-1!" : "text-n-7 dark:text-n-9"
                            }`}
                        anchor="top end"
                    />
                )}
            </div>

            <LoginModal
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Menu;
