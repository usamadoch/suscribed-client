import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { NavigationItem } from "@/hooks/useNavigation";
import { useRouter } from "next/navigation";

type MenuItemProps = {
    link: NavigationItem;
    isActive: boolean;
    visible?: boolean;
    isMinimize?: boolean;
    dynamicCount?: number;
    isAuthenticated: boolean;
    onNavClick: (e: React.MouseEvent, link: NavigationItem) => void;
    onShowLoginModal: () => void;
};

const MenuItem = ({
    link,
    isActive,
    visible,
    isMinimize,
    dynamicCount,
    isAuthenticated,
    onNavClick,
    onShowLoginModal
}: MenuItemProps) => {
    const router = useRouter();

    const hasDynamicCounter = typeof dynamicCount === "number";
    const showCounter = hasDynamicCounter ? dynamicCount > 0 : !!link.counter;
    const counterValue = hasDynamicCounter ? dynamicCount : link.counter;

    const handleSuffixClick = (e: React.MouseEvent) => {
        if (link.suffixUrl) {
            e.preventDefault();
            e.stopPropagation();

            if (!isAuthenticated) {
                onShowLoginModal();
                return;
            }
            router.push(link.suffixUrl);
        }
    };

    return (
        <Link
            className={twMerge(
                `flex items-center h-9.5 mb-2 px-4 dark:text-n-9 dark:fill-n-9 font-semibold last:mb-0 transition-colors ${isActive ? "bg-n-5 text-purple-1 fill-purple-1 rounded-md" : ""
                } ${visible ? "text-sm" : isMinimize ? "text-[0px] px-0 justify-center" : "text-sm xl:text-0 xl:px-0 xl:justify-center"}`
            )}
            href={link.url}
            target={link.target}
            onClick={(e) => onNavClick(e, link)}
        >
            <Icon
                className={`shrink-0  ${visible ? "mr-3" : isMinimize ? "mr-0" : "mr-3 xl:mr-0"}`}
                icon={link.icon as LucideIcon}
            />
            {link.title}

            {link.suffixIcon ? (
                <div
                    className={`group ml-auto flex items-center justify-center overflow-hidden transition-all duration-300 tablet:hidden ${link.suffixIconBg
                        ? "bg-purple-2 rounded-full hover:bg-purple-1 h-[30px] min-w-[30px] px-1.5"
                        : "opacity-50 hover:opacity-100 p-1"
                        } ${visible ? "" : isMinimize ? "hidden!" : "xl:hidden!"}`}
                    onClick={handleSuffixClick}
                >
                    {link.suffixText && (
                        <span
                            className={`max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 group-hover:mr-1 text-[10px] uppercase font-bold tracking-wider ${link.suffixIconBg ? "text-n-9" : ""
                                } ${visible ? "block" : isMinimize ? "hidden" : "xl:hidden"}`}
                        >
                            {link.suffixText}
                        </span>
                    )}

                    {link.suffixIcon && (
                        <Icon
                            className={`${link.suffixIconBg ? "text-white" : ""} transition-colors icon-18 shrink-0 ${visible ? "block" : isMinimize ? "hidden" : "xl:hidden"
                                }`}
                            icon={link.suffixIcon as LucideIcon}
                        />
                    )}
                </div>
            ) : showCounter ? (
                <div
                    className={`min-w-[1.625rem] ml-auto px-1 py-0.25 text-center text-xs font-bold text-n-1 ${visible ? "block" : isMinimize ? "hidden" : "xl:hidden"
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
};

export default MenuItem;
