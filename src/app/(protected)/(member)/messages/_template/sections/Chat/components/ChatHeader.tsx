import Icon from "@/components/Icon";
import Image from "@/components/Image";

type ChatHeaderProps = {
    visible: boolean;
    onClose: () => void;
    otherUser: { displayName: string; avatarUrl?: string } | null;
};

const ChatHeader = ({ onClose, otherUser }: ChatHeaderProps) => (
    <div className="flex mb-5 p-5 border-b border-n-1 dark:border-n-6">
        <button
            className="btn-stroke btn-square btn-small hidden mr-2 lg:block"
            onClick={onClose}
        >
            <Icon name="close" />
        </button>

        <div className="flex items-center mx-auto pl-12 pr-2 text-sm font-bold lg:px-3">
            {otherUser && (
                <>
                    <div className="relative w-6 h-6 mr-2 dark:text-n-9">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="navbar"
                            src={otherUser.avatarUrl}
                            fill
                            alt={otherUser.displayName || "Avatar"}
                        />
                    </div>
                    {otherUser.displayName}
                </>
            )}
        </div>

        <button className="btn-stroke btn-square btn-small">
            <Icon name="dots" />
        </button>
    </div>
);

export default ChatHeader;
