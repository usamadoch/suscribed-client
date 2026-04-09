import { MenuButton, Menu as MenuDropdown, MenuItem, MenuItems } from "@headlessui/react";
import Icon from "@/components/Icon";
import Link from "next/link";

type ActionItem = {
    icon?: string;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    viewBox?: string;
    className?: string; // Allow custom class for specific items
};

type ActionMenuProps = {
    items: ActionItem[];
    className?: string;
    buttonClass?: string;
    iconName?: string;
    iconClass?: string;
    iconViewBox?: string;
    anchor?: any;
    portal?: boolean;
    showFooterLinks?: boolean;
    itemClass?: string;
    menuItemsClass?: string;
};

const ActionMenu = ({
    items,
    className,
    buttonClass = "btn-transparent-dark btn-square btn-small focus:outline-none",
    iconName = "dots",
    iconClass,
    iconViewBox,
    anchor,
    portal = false,
    showFooterLinks = false,
    itemClass = "flex items-center cursor-pointer w-full h-10 mb-1.5 last:mb-0 px-6.5 text-sm font-bold text-n-1 transition-colors dark:text-n-9",
    menuItemsClass = "z-[9999] absolute border border-n-6 rounded-sm right-0 top-full mt-2 min-w-[14.69rem] py-2 bg-white dark:bg-n-1 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 ",
}: ActionMenuProps) => {
    const containerClass = `relative inline-flex w-fit ${className || ""}`.trim();

    return (
        <MenuDropdown className={containerClass} as="div">
            <MenuButton className={`${buttonClass} focus:outline-none`} onClick={(e) => e.stopPropagation()}>
                <Icon name={iconName} className={iconClass} viewBox={iconViewBox} />
            </MenuButton>
            <MenuItems
                transition
                anchor={anchor}
                portal={portal}
                modal={false}
                className={`${menuItemsClass} focus:outline-none`}
            >
                {items.map((item, index) => (
                    <MenuItem
                        key={index}
                        className={item.className || itemClass}
                        as="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            item.onClick(e);
                        }}
                    >
                        {item.icon && (
                            <Icon
                                className={`-mt-0.25 mr-3 fill-n-1 dark:fill-white`}
                                name={item.icon}
                                viewBox={item.viewBox}
                            />
                        )}
                        {item.label}
                    </MenuItem>
                ))}
                {showFooterLinks && (
                    <div className="flex items-center gap-6.5 border-t border-n-6 pt-2 px-6.5 overflow-x-auto overflow-y-hidden scrollbar-none whitespace-nowrap text-sm text-n-7 dark:text-white/40">
                        <Link href="/about" className="h-10 flex items-center shrink-0 cursor-pointer transition-colors">about</Link>
                        <Link href="/contact" className="h-10 flex items-center shrink-0 cursor-pointer transition-colors">contact</Link>
                        <Link href="/privacy" className="h-10 flex items-center shrink-0 cursor-pointer transition-colors">privacy</Link>
                        <Link href="/terms" className="h-10 flex items-center shrink-0 cursor-pointer transition-colors">terms</Link>
                    </div>
                )}
            </MenuItems>
        </MenuDropdown>
    );
};

export default ActionMenu;
