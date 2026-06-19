import { useRef, useCallback, useMemo } from "react";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { useSuperChatTiers } from "@/hooks/useSuperChatAPI";
import { LiveMessage, CommonsMessage } from "./hooks/useLiveSocket";

interface PinnedSuperchatsProps {
    messages: LiveMessage[];
    now: number;
}

export default function PinnedSuperchats({ messages, now }: PinnedSuperchatsProps) {
    const { getTier } = useSuperChatTiers();
    const superchatsRef = useRef<HTMLDivElement>(null);

    const scrollSuperchats = useCallback((direction: "left" | "right") => {
        if (superchatsRef.current) {
            const { scrollLeft, clientWidth } = superchatsRef.current;
            const scrollAmount = clientWidth * 0.6;
            superchatsRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth"
            });
        }
    }, []);

    const pinnedSuperchats = useMemo(() => {
        const paidMessages = messages.filter(m => m.source === "commons" && m.type === "paid") as CommonsMessage[];
        return paidMessages.map(msg => {
            const amount = msg.amountPKR || 0;
            const tier = getTier(amount);

            const pinDurationMs = (tier.pinTimeMinutes || 0) * 60 * 1000;
            const msgTime = new Date(msg.timestamp).getTime();
            const elapsed = now - msgTime;

            let timeLeftPercent = 0;
            if (pinDurationMs > 0) {
                timeLeftPercent = Math.max(0, 100 - (elapsed / pinDurationMs) * 100);
            }

            return {
                id: msg.id,
                amount: amount,
                bg: tier.bg,
                textareaBg: tier.textareaBg,
                username: msg.senderName,
                avatarUrl: msg.senderAvatar || "/images/avatars/avatar-1.jpg",
                textDark: tier.textDark,
                timeLeftPercent,
            };
        }).filter(sc => sc.timeLeftPercent > 0).reverse(); // Display most recent first (left to right)
    }, [messages, getTier, now]);

    if (pinnedSuperchats.length === 0) return null;

    return (
        <div className="relative mt-3 group">
            {/* Left Scroll Button */}
            <button
                onClick={() => scrollSuperchats("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-20 w-8 h-8 opacity-0 btn btn-square btn-stroke group-hover:opacity-100 transition-opacity"
            >
                <Icon name="arrow-prev" className="icon-20 fill-n-1 dark:fill-n-9" />
            </button>

            <div ref={superchatsRef} className="flex items-center gap-2 overflow-hidden scroll-smooth">
                {pinnedSuperchats.map((sc) => (
                    <div
                        key={sc.id}
                        className="relative flex items-center gap-2 px-2 py-1 rounded-full overflow-hidden shrink-0 cursor-pointer"
                        style={{ backgroundColor: sc.bg }}
                        title={`Rs ${sc.amount} by ${sc.username}`}
                    >
                        {/* Progress bar background (Left anchored, shrinking) */}
                        <div
                            className="absolute top-0 bottom-0 left-0 z-0 transition-all duration-1000"
                            style={{ backgroundColor: sc.textareaBg, width: `${sc.timeLeftPercent}%` }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-1">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                                <Image
                                    className="object-cover"
                                    src={sc.avatarUrl}
                                    fill
                                    alt="Avatar"
                                />
                            </div>
                            <span className={`text-[13px] font-bold max-w-20 truncate ${sc.textDark ? 'dark:text-n-4/80' : 'dark:text-n-9'}`}>
                                {sc.username}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scrollSuperchats("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-20 w-8 h-8 opacity-0 btn btn-square btn-stroke group-hover:opacity-100 transition-opacity"
            >
                <Icon name="arrow-next" className="icon-20 fill-n-1 dark:fill-n-9" />
            </button>
        </div>
    );
}
