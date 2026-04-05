import { useState } from "react";
import ActionMenu from "@/components/ActionMenu";

import Logo from "@/components/Logo";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useAuth } from "@/store/auth";

import Menu from "./Menu";
import TeamMembers from "./TeamMembers";

type SidebarProps = {};

const Sidebar = ({ }: SidebarProps) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [visible, setVisible] = useState<boolean>(false);


    return (
        <div
            className={`fixed top-0 left-0 bottom-0 flex flex-col w-75 py-6 px-8 bg-background border-r border-n-4 overflow-auto scroll-smooth xl:z-30 md:hidden ${visible ? "w-75" : "xl:w-20"
                }`}
        >
            <div className="flex justify-between items-center h-[1.625rem] mb-11">
                <Logo className={visible ? "flex" : "xl:hidden"} light />
                <button
                    className="hidden xl:flex"
                    onClick={() => setVisible(!visible)}
                >
                    <Icon
                        className="fill-n-1"
                        name={visible ? "close" : "burger"}
                    />
                </button>
            </div>
            {/* <div className="flex-1 overflow-y-auto scroll-smooth -mr-4 pr-4"> */}
            <Menu visible={visible} />
            {isAuthenticated && <TeamMembers visible={visible} />}
            {/* </div> */}


            {isAuthenticated && (

                <div
                    className={`flex items-center mt-auto mx-0 pt-10 ${visible ? "mx-0" : "xl:-mx-4"
                        }`}
                >
                    <div
                        className={`inline-flex items-center font-semibold text-n-1 text-sm transition-colors ${visible ? "mx-0 text-sm" : "xl:mx-auto xl:text-0"
                            }`}
                    >
                        <div
                            className={`relative w-5.5 h-5.5 mr-2.5  border border-n-4 rounded-full overflow-hidden ${visible ? "mr-2.5" : "xl:mr-0"
                                }`}
                        >
                            <Image
                                className="object-cover scale-105"
                                src={user?.avatarUrl || "/images/avatars/avatar.jpg"}
                                fill
                                alt="Avatar"
                            />
                        </div>
                        {user?.displayName || "Guest"}
                    </div>

                    <ActionMenu
                        className={`ml-auto ${visible ? "block" : "xl:hidden"}`}
                        buttonClass="btn-transparent-light fill-n-1 btn-square btn-small cursor-pointer"
                        anchor="top start"
                        showFooterLinks

                        menuItemsClass="z-[9999] w-[14.69rem] py-2 bg-white dark:bg-n-1 focus:outline-none [--anchor-gap:10px] transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                        portal

                        items={[
                            {
                                label: "Logout",
                                icon: "arrow-next",
                                onClick: logout,
                            }
                        ]}
                    />
                </div>

            )}
        </div>
    );
};

export default Sidebar;
