




import Table from "@/components/Table";
import ActionMenu from "@/components/ActionMenu";
import Sorting from "@/components/Sorting";
import { format } from "date-fns";
import Link from "next/link";

import { LiveSession } from "@/services/live.service";
import { useState } from "react";
import { toast } from "react-hot-toast";
import DeletePostModal from "@/components/modals/DeletePostModal";
import { useDeleteLiveSession } from "@/hooks/queries";

// Mock data removed

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


const LiveRow = ({ item }: { item: LiveSession }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { mutate: deleteSession, isPending } = useDeleteLiveSession();

    const handleDelete = () => {
        deleteSession(item._id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                toast.error("Failed to delete live broadcast");
            }
        });
    };

    return (
        <tr className="">
            <td className="td-custom py-3.5">
                <Link
                    className="inline-flex items-center text-sm transition-colors"
                    href={`/live-room/${item._id}`}
                >
                    <div className="flex flex-col gap-1 w-full">
                        <div className="text-n-2 4xl:max-w-70 dark:text-n-9 font-medium hover:text-purple-1 transition-colors">
                            {item.title || "Untitled Live Stream"}
                        </div>
                        <div className="mt-1">
                            <span className={`capitalize ${getStatusBadgeClass(item.status)} inline-block py-0.5 px-2 rounded-full text-xs font-semibold`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                </Link>
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8 capitalize">
                {item.accessType === 'public' ? 'everyone' : 'members only'}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8 font-medium">
                {item.peakViewerCount || 0}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8 font-medium">
                Rs {item.totalCollected?.toLocaleString() || 0}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8">
                {item.totalPaidMessages || 0}
            </td>
            <td className="td-custom py-3.5 text-n-3 dark:text-n-8">
                {item.startedAt ? format(new Date(item.startedAt), 'MMM d, yyyy') : (item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : 'N/A')}
            </td>
            <td className="td-custom py-3.5 text-right">
                <ActionMenu
                    buttonClass="btn-stroke btn-small btn-square"
                    items={[
                        {
                            icon: "external-link",
                            label: "Open control room",
                            onClick: () => window.location.href = `/live-room/${item._id}/control`
                        },
                        {
                            icon: "remove",
                            label: "Delete",
                            className: "flex items-center cursor-pointer w-full px-7 py-2 text-sm font-bold text-pink-1",
                            onClick: () => setIsDeleteModalOpen(true)
                        }
                    ]}
                />
                <DeletePostModal
                    visible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                    isPending={isPending}
                />
            </td>
        </tr>
    );
};

const LiveTable = ({ items, isLoading }: { items: LiveSession[]; isLoading: boolean }) => (
    <Table
        isLoading={isLoading}
        items={items}
        emptyMessage="No live broadcasts found."
        headers={[
            {
                className: "w-[30%] text-left",
                render: () => <Sorting title="Title" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Visibility" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Peak Viewers" />
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
