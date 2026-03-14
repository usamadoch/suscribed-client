




import Link from "next/link";
import { MenuButton, Menu as MenuDropdown, MenuItem, MenuItems, Transition } from "@headlessui/react";
import Icon from "@/components/Icon";

type ProfileHeaderActionsProps = {
    isOwner: boolean;
    isMember: boolean;
    onJoinClick: () => void;
    onShareClick: () => void;
};

const ProfileHeaderActions = ({ isOwner, isMember, onJoinClick, onShareClick }: ProfileHeaderActionsProps) => {
    if (isOwner) {
        return (
            <div className="flex shrink-0 max-w-60 w-full">
                <Link href="/settings" className="btn-purple grow">
                    <Icon name="setup" />
                    <span className="">Edit Profile</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex shrink-0 max-w-80 w-full 4xl:w-59">
            <button
                className={`btn-purple h-12 grow ${isMember ? "opacity-75" : ""}`}
                onClick={isMember ? undefined : onJoinClick}
                disabled={isMember}
            >
                {isMember && <Icon name="check" />}
                <span>{isMember ? "Member" : "Become a Member"}</span>
            </button>

            <MenuDropdown className="relative ml-1.5 shrink-0" as="div">
                <MenuButton className="btn-purple h-12 px-4">
                    <Icon name="dots" />
                </MenuButton>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <MenuItems className="absolute right-0 top-full mt-2 w-[14.69rem] py-2 border border-n-1 bg-white shadow-primary-4 dark:bg-n-1 dark:border-white z-10">
                        <MenuItem
                            className="flex items-center cursor-pointer w-full h-10 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                            as="button"
                            onClick={onShareClick}
                        >
                            <Icon
                                className="-mt-0.25 mr-3 fill-n-1 dark:fill-white"
                                name="share"
                            />
                            Share
                        </MenuItem>
                    </MenuItems>
                </Transition>
            </MenuDropdown>
        </div>
    );
};

export default ProfileHeaderActions;
