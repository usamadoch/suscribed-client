



"use client"



import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionMenu from "@/components/ActionMenu";

import Logo from "@/components/Logo";
import Image from "@/components/Image";
import { Icon } from "@/components/ui/icon";
import { Menu as MenuIcon, X, Plus, FileText, Radio, LogOut } from "@/lib/icons";
import { useAuth } from "@/store/auth";

import Menu from "./Menu";
import TeamMembers from "./TeamMembers";

type SidebarProps = {
    isMinimize?: boolean;
};

const Sidebar = ({ isMinimize = false }: SidebarProps) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [visible, setVisible] = useState<boolean>(false);


    const router = useRouter();

    const createMenuItems = [
        {
            label: "Post",
            icon: FileText,
            onClick: () => router.push("/posts/new"),
        },
        {
            label: "Live",
            icon: Radio,
            onClick: () => router.push("/live-room/new"),
        },
    ];


    return (
        <div
            className={`fixed top-0 left-0 bottom-0 flex flex-col bg-background dark:bg-n-2 border-r border-n-6 overflow-y-auto overflow-x-hidden scroll-smooth xl:z-30 md:hidden ${
                visible ? "w-75 py-6 px-8" : isMinimize ? "w-16 py-6 px-3" : "w-75 py-6 px-8 xl:w-16 xl:px-3"
            }`}>
            <div className={`flex items-center h-[1.625rem] mb-11 ${visible ? "justify-between" : isMinimize ? "justify-center" : "justify-between xl:justify-center"}`}>
                <Logo 
                    className={visible ? "flex" : "xl:hidden"} 
                    light 
                    textClassName={visible ? "" : isMinimize ? "hidden" : "xl:hidden"}
                />
                <button
                    className="hidden xl:flex"
                    onClick={() => setVisible(!visible)}
                >
                    <Icon
                        className="text-n-9  cursor-pointer"
                        icon={visible ? X : MenuIcon}
                    />
                </button>
            </div>
            {/* <div className="flex-1 overflow-y-auto scroll-smooth -mr-4 pr-4"> */}
            <Menu visible={visible} isMinimize={isMinimize} />
            {isAuthenticated && <TeamMembers visible={visible} isMinimize={isMinimize} />}
            {/* </div> */}


            {isAuthenticated && (
                <div className="mt-auto flex flex-col pt-10 mx-0">
                    {user?.role === "creator" && (
                        <ActionMenu
                            className={`mb-6 ${visible ? "w-full" : isMinimize ? "w-auto mx-auto" : "w-full xl:w-auto xl:mx-auto"}`}
                            buttonClass={`btn-purple btn-medium flex items-center justify-center ${visible ? "gap-2 w-full px-5" : isMinimize ? "w-10 h-10 p-0 mx-auto gap-0" : "gap-2 w-full px-5 xl:w-10 xl:h-10 xl:p-0 xl:mx-auto xl:gap-0"
                                }`}
                            anchor="top start"
                            portal
                            menuItemsClass="z-[9999] w-[14.69rem] py-2 bg-white dark:bg-n-1 border border-n-6 focus:outline-none [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                            items={createMenuItems}
                        >
                            <Icon className={`text-n-1 icon-18 shrink-0 ${isMinimize && !visible ? "mr-0!" : ""}`} icon={Plus} strokeWidth={2} />
                            <span className={`transition-all ${visible ? "inline" : isMinimize ? "hidden" : "xl:hidden"}`}>Create</span>
                        </ActionMenu>
                    )}




                    <div className="flex items-center mx-0 w-full">
                        <div className={`inline-flex items-center font-semibold text-n-9 transition-colors ${visible ? "mx-0 text-sm" : isMinimize ? "mx-auto text-[0px]" : "text-sm xl:mx-auto xl:text-0"}`}>
                            <ActionMenu
                                className={`shrink-0 mr-2.5 ${visible ? "mr-2.5" : isMinimize ? "mr-0!" : "xl:mr-0"}`}
                                buttonClass={`block focus:outline-none w-5.5 h-5.5 rounded-full ${isMinimize ? "cursor-pointer pointer-events-auto" : visible ? "cursor-default pointer-events-none" : "pointer-events-none cursor-default xl:pointer-events-auto xl:cursor-pointer"}`}
                                anchor="top start"
                                showFooterLinks
                                menuItemsClass="z-[9999] w-[14.69rem] py-2 bg-white dark:bg-n-1 border border-n-6 focus:outline-none [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                                portal
                                items={[
                                    {
                                        label: "Logout",
                                        icon: LogOut,
                                        onClick: logout,
                                    }
                                ]}
                            >
                                <div className={`relative w-5.5 h-5.5 border border-n-6 rounded-full overflow-hidden`}>
                                    <Image
                                        className="object-cover scale-105"
                                        family="avatar"
                                        slot="sidebar"
                                        src={user?.avatarUrl}
                                        fill
                                        alt="Avatar"
                                    />
                                </div>
                            </ActionMenu>
                            {user?.displayName || "Guest"}
                        </div>

                        <ActionMenu
                            className={`ml-auto ${visible ? "block" : isMinimize ? "hidden!" : "xl:hidden"}`}
                            buttonClass="btn-transparent-light fill-n-9 btn-square btn-small hover:fill-n-9 cursor-pointer"
                            anchor="top start"
                            showFooterLinks
                            menuItemsClass="z-[9999] w-[14.69rem] py-2 bg-white dark:bg-n-1 border border-n-6 focus:outline-none [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                            portal
                            items={[
                                {
                                    label: "Logout",
                                    icon: LogOut,
                                    onClick: logout,
                                }
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
