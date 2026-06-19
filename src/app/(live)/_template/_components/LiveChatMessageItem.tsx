import Image from "@/components/Image";
import { truncateMessage, renderMessageText } from "@/utils/chatFormatting";
import { useSuperChatTiers } from "@/hooks/useSuperChatAPI";
import { LiveMessage, YouTubeMessage, CommonsMessage } from "./hooks/useLiveSocket";

interface LiveChatMessageItemProps {
    msg: LiveMessage;
}

export default function LiveChatMessageItem({ msg }: LiveChatMessageItemProps) {
    const { getTier } = useSuperChatTiers();

    // ── Superchat / Paid Message Card ──
    if (msg.source === "commons" && msg.type === "paid") {
        const cm = msg as CommonsMessage;
        const truncatedText = truncateMessage(cm.message);
        const amount = cm.amountPKR || 0;
        const tier = getTier(amount);

        return (
            <div className="rounded-xl px-4 py-3 flex flex-col relative overflow-hidden shrink-0 transition-colors duration-300 shadow-sm mb-2" style={{ backgroundColor: tier.bg }}>
                <div className={`flex items-center gap-3 relative z-10 ${tier.canMessage && cm.message ? 'mb-2' : ''}`}>
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
                </div>
                {tier.canMessage && cm.message && (
                    <div className={`w-full text-[15px] font-medium relative z-10 wrap-break-words transition-colors duration-300 ${tier.textDark ? 'dark:text-n-4 text-n-4/60' : 'dark:text-n-9 text-n-9'}`}>
                        {renderMessageText(truncatedText)}
                    </div>
                )}
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
        <div className="flex gap-4 items-start">
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
        </div>
    );
}
