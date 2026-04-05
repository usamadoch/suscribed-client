




import Link from "next/link";
import ActionMenu from "@/components/ActionMenu";
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
                className={`btn-purple btn-medium grow ${isMember ? "opacity-75" : ""}`}
                onClick={isMember ? undefined : onJoinClick}
                disabled={isMember}
            >
                {isMember && <Icon name="check" />}
                <span>{isMember ? "Member" : "Become a Member"}</span>
            </button>

            <ActionMenu
                className="ml-4 shrink-0"
                buttonClass="btn-purple btn-medium px-4 focus:outline-none"
                items={[
                    {
                        icon: "share",
                        label: "Share",
                        onClick: onShareClick,
                        className: "flex items-center cursor-pointer w-full h-8 mb-1.5 px-6.5 text-sm font-bold text-n-1 transition-colors hover:bg-n-3/10 dark:text-white dark:hover:bg-white/20"
                    }
                ]}
            />
        </div>
    );
};

export default ProfileHeaderActions;
