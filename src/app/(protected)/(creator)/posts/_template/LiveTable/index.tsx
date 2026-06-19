import React from "react";
import Table from "@/components/Table";
import Icon from "@/components/Icon";
import ActionMenu from "@/components/ActionMenu";
import Sorting from "@/components/Sorting";
import { format } from "date-fns";
import Link from "next/link";

export interface MockLiveItem {
    _id: string;
    title: string;
    status: 'live' | 'scheduled' | 'ended' | 'draft';
    platform: string;
    collected: string;
    messages: number;
    date: string;
}

export const mockLiveData: MockLiveItem[] = [
    {
        _id: "live-1",
        title: "Weekly Q&A and Community Hangout",
        status: "live",
        platform: "YouTube",
        collected: "$150.00",
        messages: 124,
        date: "2026-06-10T15:00:00.000Z"
    },
    {
        _id: "live-2",
        title: "Exclusive Behind-the-Scenes Stream",
        status: "scheduled",
        platform: "Facebook",
        collected: "$0.00",
        messages: 0,
        date: "2026-06-12T18:00:00.000Z"
    },
    {
        _id: "live-3",
        title: "Cozy Coding & Chill Music",
        status: "ended",
        platform: "YouTube",
        collected: "$425.50",
        messages: 890,
        date: "2026-06-08T10:00:00.000Z"
    },
    {
        _id: "live-4",
        title: "Unboxing New Tech & Setup Review",
        status: "draft",
        platform: "Instagram",
        collected: "$0.00",
        messages: 0,
        date: "2026-06-15T12:00:00.000Z"
    }
];

const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'live':
            return 'label-stroke-green';
        case 'scheduled':
            return 'label-stroke-purple';
        case 'ended':
            return 'label-stroke-pink';
        case 'draft':
        default:
            return 'label-stroke';
    }
};

const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'youtube') return 'youtube';
    if (p === 'facebook') return 'facebook';
    if (p === 'instagram') return 'instagram';
    return 'video';
};

const LiveRow = ({ item }: { item: MockLiveItem }) => {
    return (
        <tr className="">
            <td className="td-custom py-3.5">
                <Link
                    className="inline-block text-sm text-n-2 4xl:max-w-70 dark:text-n-9 hover:text-purple-1 transition-colors"
                    href={`/live/${item._id}/control`}
                >
                    {item.title}
                </Link>
            </td>
            <td className="td-custom py-3.5">
                <span className={`capitalize ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                </span>
            </td>
            <td className="td-custom py-3.5 capitalize text-n-3 dark:text-n-8">
                <div className="flex items-center gap-1.5">
                    <Icon name={getPlatformIcon(item.platform)} className="w-4 h-4 fill-n-1 dark:fill-white" />
                    <span>{item.platform}</span>
                </div>
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8 font-medium">
                {item.collected}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8">
                {item.messages}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8">
                {format(new Date(item.date), 'MMM d, yyyy')}
            </td>
            <td className="td-custom py-3.5 text-right">
                <ActionMenu
                    buttonClass="btn-stroke btn-small btn-square"
                    items={[
                        {
                            icon: "external-link",
                            label: "Open control room",
                            onClick: () => window.location.href = `/live/${item._id}/control`
                        },
                        {
                            icon: "chart",
                            label: "View report",
                            onClick: () => alert(`Viewing report for "${item.title}"...`)
                        },
                        {
                            icon: "edit",
                            label: "Edit",
                            onClick: () => alert(`Editing stream: "${item.title}"...`)
                        },
                        {
                            icon: "remove",
                            label: "Delete",
                            className: "flex items-center cursor-pointer w-full px-7 py-2 text-sm font-bold text-pink-1",
                            onClick: () => alert(`Deleting stream: "${item.title}"...`)
                        }
                    ]}
                />
            </td>
        </tr>
    );
};

const LiveTable = ({ items, isLoading }: { items: MockLiveItem[]; isLoading: boolean }) => (
    <Table
        isLoading={isLoading}
        items={items}
        emptyMessage="No live broadcasts found."
        headers={[
            {
                className: "w-[40%] text-left",
                render: () => <Sorting title="Title" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Status" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Platform" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Collected" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Messages" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Date" />
            },
            {
                className: "text-left"
            }
        ]}
        renderRow={(liveItem) => (
            <LiveRow item={liveItem} key={liveItem._id} />
        )}
    />
);

export default LiveTable;
