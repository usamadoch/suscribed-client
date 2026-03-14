import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { twMerge } from "tailwind-merge";
import { useNavigation, NavigationItem } from "@/hooks/useNavigation";
import { useSocket } from "@/store/socket";

type MenuProps = {
    visible?: boolean;
};

const Menu = ({ visible }: MenuProps) => {
    const pathname = usePathname();
    const navigationItems = useNavigation();

    const { unreadCount, messageUnreadCount } = useSocket();

    return (
        <>
            <div
                className={`mb-3 overflow-hidden whitespace-nowrap text-xs font-medium text-white/50 ${visible ? "w-full opacity-100" : "xl:w-0 xl:opacity-0"
                    }`}
            >
                Navigation
            </div>
            <div className="-mx-4 mb-10">
                {navigationItems.map((link: NavigationItem, index: number) => {
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
                                `flex items-center h-9.5 mb-2 px-4 text-sm text-white fill-white font-bold last:mb-0 transition-colors hover:bg-n-2 ${isActive ? "bg-n-2 text-purple-1 fill-purple-1" : ""
                                } ${visible ? "text-sm" : "xl:text-0"}`
                            )}
                            href={link.url}
                            key={index}
                            target={link.target}
                        >
                            <Icon
                                className={`mr-3 fill-inherit ${visible ? "mr-3" : "xl:mr-0"
                                    }`}
                                name={link.icon}
                            />
                            {link.title}

                            {link.suffixIcon ? (

                                <Icon
                                    className={` ml-auto fill-inherit transition-colors ${visible ? "block" : "xl:hidden"
                                        }`}
                                    name={link.suffixIcon}
                                    viewBox={link.suffixIconViewBox}
                                />
                            ) : showCounter ? (

                                <div
                                    className={`min-w-[1.625rem] ml-auto px-1 py-0.25 text-center text-xs font-bold text-n-1 ${visible ? "block" : "xl:hidden"
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
        </>
    );
};

export default Menu;
