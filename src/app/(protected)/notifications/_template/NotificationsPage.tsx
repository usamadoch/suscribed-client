
"use client"
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import MailDesktop from "./MailDesktop";
import MailTablet from "./MailTablet";

import Empty from "@/components/Empty";
import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Notification as AppNotification } from "@/lib/types";

import { useHydrated } from "@/hooks/useHydrated";
import { useNotifications, useMarkNotificationsAsRead } from "@/hooks/useQueries";

import { useSocket } from "@/store/socket";

import Layout from "@/layout";
import Loader from "@/components/Loader";


const NotificationsPage = () => {
    const { mounted } = useHydrated();
    const { data, isLoading, error } = useNotifications();
    const markAllReadMutation = useMarkNotificationsAsRead();
    const { markAllAsReadLocal } = useSocket();

    // Auto-mark as read on visit
    useEffect(() => {
        markAllReadMutation.mutate(undefined, {
            onSuccess: () => {
                markAllAsReadLocal();
            }
        });
    }, []);

    const notifications = data?.notifications || [];

    const isTablet = useMediaQuery({
        query: "(max-width: 1023px)",
    });

    return (
        <Layout title="Notifications" background={!isLoading && notifications.length === 0}>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center gap-3">
                    <Icon name="info-circle" className="w-6 h-6 fill-n-1 dark:fill-white" />
                    <p className="text-n-1 dark:text-white">Failed to load notifications</p>
                </div>
            ) : notifications.length === 0 ? (
                <Empty
                    title="No notifications yet"
                    content="You’ll get updates when people join your community, interact with your posts and more."
                    imageSvg={
                        <Icon
                            name="notification"
                            className="w-24 h-24 fill-n-1 dark:fill-white"
                        />
                    }
                // buttonText="Return Home"
                // onClick={() => router.push("/")}
                />
            ) : (
                <>
                    <div className="card">
                        {notifications.map((notification: AppNotification) =>
                            mounted && isTablet ? (
                                <MailTablet item={notification} key={notification._id} />
                            ) : (
                                <MailDesktop item={notification} key={notification._id} />
                            )
                        )}
                    </div>
                    {/* <TablePagination /> */}
                </>
            )}
        </Layout>
    );
};

export default NotificationsPage;
