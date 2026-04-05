import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { twMerge } from "tailwind-merge";
import { useNavigation, NavigationItem } from "@/hooks/useNavigation";
import { useSocket } from "@/store/socket";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/modals/LoginModal";

type MenuProps = {
    visible?: boolean;
};

const Menu = ({ visible }: MenuProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const navigationItems = useNavigation();
    const { isAuthenticated } = useAuth();

    const { unreadCount, messageUnreadCount } = useSocket();

    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleNavClick = (e: React.MouseEvent, link: NavigationItem) => {
        // If the user is not authenticated and the route is NOT public, intercept
        if (!isAuthenticated && !link.isPublicRoute) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <div className="-mx-4 mb-10">
                {(() => {
                    const grouped: Record<string, NavigationItem[]> = {};
                    navigationItems.forEach((link) => {
                        const cat = link.category || "Navigation";
                        if (!grouped[cat]) grouped[cat] = [];
                        grouped[cat].push(link);
                    });

                    return Object.entries(grouped).map(([category, links], catIndex) => (
                        <div key={catIndex} className="mb-6 last:mb-0">
                            <div
                                className={`mb-3 px-4 uppercase overflow-hidden whitespace-nowrap text-[11px] font-medium text-n-1 ${visible ? "w-full opacity-100" : "xl:text-0 xl:opacity-0"
                                    }`}
                            >
                                {category}
                            </div>
                            {links.map((link: NavigationItem, index: number) => {
                                // Centralized configuration for dynamic counters
                                // Add new counters here mapping the URL to the count value
                                const dynamicCounters: Record<string, number> = {
                                    "/notifications": unreadCount,
                                    "/messages": messageUnreadCount,
                                };

                                const dynamicCount = dynamicCounters[link.url];
                                const hasDynamicCounter = typeof dynamicCount === "number";

                                // Determine what to show:
                                // 1. If it's a dynamic counter link (e.g. notifications), show only if count > 0
                                // 2. If it has a static counter defined in navigation config, show it
                                const showCounter = hasDynamicCounter ? dynamicCount > 0 : !!link.counter;
                                const counterValue = hasDynamicCounter ? dynamicCount : link.counter;

                                // Check if the current pathname matches the link exactly, or if it's a sub-route of the link.
                                const isActive = pathname === link.url || (link.url !== "/" && pathname.startsWith(`${link.url}/`));

                                return (
                                    <Link
                                        className={twMerge(
                                            `flex items-center h-9.5 mb-2 px-4 text-sm text-n-1 fill-n-1 font-semibold last:mb-0 transition-colors hover:bg-[#F2EAE3] ${isActive ? "bg-[#F2EAE3] text-purple-1 fill-purple-1" : ""
                                            } ${visible ? "text-sm" : "xl:text-0"}`
                                        )}
                                        href={link.url}
                                        key={index}
                                        target={link.target}
                                        onClick={(e) => handleNavClick(e, link)}
                                    >
                                        <Icon
                                            className={`mr-3 fill-inherit ${visible ? "mr-3" : "xl:mr-0"
                                                }`}
                                            name={link.icon}
                                        />
                                        {link.title}

                                        {link.suffixIcon ? (

                                            <div
                                                className={`group ml-auto flex items-center justify-center overflow-hidden transition-all duration-300 ${link.suffixIconBg
                                                    ? "bg-purple-2 rounded-full hover:bg-purple-1 h-[30px] min-w-[30px] px-1.5"
                                                    : "opacity-50 hover:opacity-100 p-1"
                                                    }`}
                                                onClick={(e) => {
                                                    if (link.suffixUrl) {
                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        if (!isAuthenticated) {
                                                            setShowLoginModal(true);
                                                            return;
                                                        }
                                                        router.push(link.suffixUrl);
                                                    }
                                                }}
                                            >
                                                {link.suffixText && (
                                                    <span className={`max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 group-hover:mr-1 text-[10px] uppercase font-bold tracking-wider ${link.suffixIconBg ? 'text-white' : ''} ${visible ? "block" : "xl:hidden"}`}>
                                                        {link.suffixText}
                                                    </span>
                                                )}

                                                <Icon
                                                    className={`${link.suffixIconBg ? 'fill-white' : 'fill-inherit'} transition-colors icon-18 shrink-0 ${visible ? "block" : "xl:hidden"
                                                        }`}
                                                    name={link.suffixIcon}
                                                    viewBox={link.suffixIconViewBox}
                                                />
                                            </div>
                                        ) : showCounter ? (

                                            <div
                                                className={`min-w-[1.625rem] ml-auto px-1 py-0.25 text-center text-xs font-bold tex t-n-1 ${visible ? "block" : "xl:hidden"
                                                    }`}
                                                style={{
                                                    backgroundColor: link.counterColor || "#AE7AFF",
                                                }}
                                            >
                                                {counterValue}
                                            </div>
                                        ) : null}
                                    </Link>
                                );
                            })}
                        </div>
                    ));
                })()}
            </div>

            {/* Login Modal for guests clicking protected routes */}
            <LoginModal
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Menu;
