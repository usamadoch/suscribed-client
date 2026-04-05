

import Link from "next/link";
import { formatAppDate } from "@/lib/date";
import { Notification as AppNotification, NotificationType } from "@/lib/types";

type MailDesktopProps = {
    item: AppNotification;
};

const MailDesktop = ({ item }: MailDesktopProps) => {

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'new_member':
                return '👤';
            case 'new_message':
                return '💬';
            case 'new_comment':
                return '💭';
            case 'new_like':
                return '❤️';
            case 'membership_expired':
                return '⏰';
            default:
                return '🔔';
        }
    };

    const getNotificationLink = (notification: AppNotification) => {
        if (notification.actionUrl) {
            return notification.actionUrl;
        }

        switch (notification.type) {
            case 'new_member':
                return '/members';
            case 'new_message':
                return '/messages';
            case 'new_comment':
            case 'new_like':
            case 'post_liked':
                return notification.metadata?.postId ? `/posts/${notification.metadata.postId}` : '#';
            default:
                return '#';
        }
    };



    return (
        <div className="flex items-start border-b border-n-4 text-sm last:border-none dark:border-white">
            <Link
                href={getNotificationLink(item)}
                className="flex items-start grow p-4 transition-colors hover:bg-n-3/5 dark:hover:bg-white/10"
            >
                <div className="flex items-center shrink-0 pr-4  w-[14.7rem]">
                    <div className="relative flex items-center justify-center shrink-0 w-8 h-8 mr-3 text-h6">
                        {getNotificationIcon(item.type)}
                    </div>
                    {item.title || "Notification"}
                </div>
                <div className="grow pt-1.5 truncate font-medium" >
                    {item.body || item.message}{" "}
                </div>
                <div className="shrink-0 w-28 ml-4 pt-1.5 text-right text-n-3">
                    {formatAppDate(item.createdAt, { suffix: true })}
                </div>
            </Link>
        </div>
    );
};

export default MailDesktop;
