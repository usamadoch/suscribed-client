import Image from "@/components/Image";
import { truncateMessage, renderMessageText } from "@/utils/chatFormatting";
import { useSuperChatTiers } from "@/hooks/useSuperChatAPI";
import { LiveMessage, YouTubeMessage, CommonsMessage } from "./hooks/useLiveSocket";
import ActionMenu from "@/components/ActionMenu";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { liveApi } from "@/services/live.service";
import toast from "react-hot-toast";
import TimeoutUserModal from "@/components/modals/TimeoutUserModal";

interface LiveChatMessageItemProps {
    msg: LiveMessage;
    isCreator?: boolean;
    sessionId?: string;
}

export default function LiveChatMessageItem({ msg, isCreator, sessionId }: LiveChatMessageItemProps) {
    const { getTier } = useSuperChatTiers();
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

    const isCommons = msg.source === "commons";

    const removeMutation = useMutation({
        mutationFn: () => liveApi.deleteChatMessage(sessionId!, msg.id),
        onSuccess: () => toast.success("Message removed"),
        onError: () => toast.error("Failed to remove message"),
    });

    const timeoutMutation = useMutation({
        mutationFn: (duration: number) => {
            const senderId = (msg as CommonsMessage).senderId;
            return liveApi.timeoutUser(sessionId!, senderId, duration);
        },
        onSuccess: () => toast.success("User timed out"),
        onError: () => toast.error("Failed to timeout user"),
    });

    const getMenuItems = () => {
        if (!isCommons) return [];
        return [
            { label: "Remove Message", onClick: () => removeMutation.mutate() },
            { label: "Timeout User", onClick: () => setIsTimeoutModalOpen(true) },
        ];
    };

    // ── Superchat / Paid Message Card ──
    if (msg.source === "commons" && msg.type === "paid") {
        const cm = msg as CommonsMessage;
        const truncatedText = truncateMessage(cm.message);
        const amount = cm.amountPKR || 0;
        const tier = getTier(amount);

        return (
            <div className="rounded-xl px-4 py-3 flex flex-col relative shrink-0 transition-colors duration-300 shadow-sm mb-2 group" style={{ backgroundColor: tier.bg }}>

                <div className={`flex items-center gap-3 relative z-10 ${tier.canMessage && cm.message ? 'mb-2' : ''} pr-8`}>
                    <div className="flex  items-center gap-3">

                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                            <Image
                                className="object-cover"
                                family="avatar"
                                slot="sidebar"
                                src={cm.senderAvatar || "/images/avatars/avatar-1.jpg"}
                                fill
                                alt="Avatar"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div>
                            <span className={`opacity-90 text-sm font-bold transition-colors duration-300 ${tier.textDark ? 'dark:text-n-4/80' : 'dark:text-n-9'}`}>
                                @{cm.senderName}
                            </span>
                            <span className={`text-[15px] font-bold ml-2 transition-colors duration-300 ${tier.textDark ? 'dark:text-n-1' : 'dark:text-n-9 '}`}>
                                Rs {amount.toLocaleString()}
                            </span>
                        </div>
                        {isCreator && isCommons && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-100">
                                <ActionMenu
                                    items={getMenuItems()}
                                    buttonClass={` focus:outline-none cursor-pointer ${tier.textDark ? "text-n-1" : "text-n-9"} hover:text-purple-1`}
                                    portal={true}
                                    anchor="bottom end"
                                />
                            </div>
                        )}


                    </div>
                </div>
                {tier.canMessage && cm.message && (
                    <div className={`w-full text-[15px] font-medium relative z-10 wrap-break-words transition-colors duration-300 ${tier.textDark ? 'dark:text-n-4 text-n-4/60' : 'dark:text-n-9 text-n-9'}`}>
                        {renderMessageText(truncatedText)}
                    </div>
                )}

                <TimeoutUserModal
                    visible={isTimeoutModalOpen}
                    onClose={() => setIsTimeoutModalOpen(false)}
                    onTimeout={(duration) => timeoutMutation.mutate(duration)}
                    isPending={timeoutMutation.isPending}
                    userName={cm.senderName}
                />
            </div>
        );
    }

    // ── Regular Chat Message (YouTube or Commons free) ──
    const isYT = msg.source === "youtube";
    const authorName = isYT ? (msg as YouTubeMessage).authorName : (msg as CommonsMessage).senderName;
    const avatar = isYT ? (msg as YouTubeMessage).authorAvatar : (msg as CommonsMessage).senderAvatar;
    const text = isYT ? (msg as YouTubeMessage).text : (msg as CommonsMessage).message;
    const truncatedText = truncateMessage(text);

    return (
        <div className="flex gap-4 items-start group relative">
            {isCreator && isCommons && (
                <div className="absolute -top-1 right-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-100">
                    <ActionMenu
                        items={getMenuItems()}
                        buttonClass=" focus:outline-none cursor-pointer hover:text-purple-1"
                        portal={true}
                        anchor="bottom end"
                    />
                </div>
            )}
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 mt-0.5">
                <Image
                    className="object-cover scale-105"
                    family="avatar"
                    slot="sidebar"
                    src={avatar || "/images/avatars/avatar-1.jpg"}
                    fill
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                />
            </div>
            <div className="flex-1 min-w-0 text-[13px] font-semibold wrap-break-words">
                <span className="font-bold text-n-4 dark:text-n-8 mr-1 shrink-0">{authorName}</span>
                <span className="text-n-1 dark:text-n-9">{renderMessageText(truncatedText)}</span>
            </div>

            <TimeoutUserModal
                visible={isTimeoutModalOpen}
                onClose={() => setIsTimeoutModalOpen(false)}
                onTimeout={(duration) => timeoutMutation.mutate(duration)}
                isPending={timeoutMutation.isPending}
                userName={authorName}
            />
        </div>
    );
}
