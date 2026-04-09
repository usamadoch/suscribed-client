
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Link from "next/link";
import { formatAppDate } from "@/lib/date";

type RowProps = {
    item: any;
};

const Row = ({ item }: RowProps) => {
    const member = (item.memberId && typeof item.memberId === 'object') ? item.memberId : {};

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-500 text-white dark:bg-green-500 dark:text-n-1';
            case 'paused': return 'bg-yellow-500 text-white dark:bg-yellow-500 dark:text-n-1';
            case 'cancelled':
            default: return 'bg-pink-500 text-white dark:bg-pink-500 dark:text-n-1';
        }
    };

    return (
        <tr className="">
            <td className="td-custom">
                {/* <Checkbox value={value} onChange={() => setValue(!value)} /> */}
            </td>
            <td className="td-custom">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 mr-4">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="sidebar"
                            src={member.avatarUrl}
                            fill
                            alt={member.displayName || "Member"}
                        />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-n-1 dark:text-white">
                            {member.displayName || "Unknown Member"}
                        </div>
                        <div className="text-xs text-n-3 dark:text-n-8">
                            @{member.username || "unknown"}
                        </div>
                    </div>
                </div>
            </td>
            <td className="td-custom font-medium dark:text-n-8">
                {item.tier || "Free"}
            </td>
            <td className="td-custom text-n-3 dark:text-n-8">
                {formatAppDate(item.joinedAt, { relative: false, dateFormat: 'MMM, d, yyyy' })}
            </td>
            <td className="td-custom text-right">
                <div className={`inline-block px-3 py-1 text-xs font-bold capitalize ${getStatusColor(item.status)}`}>
                    {item.status}
                </div>
            </td>
            <td className="td-custom text-right">

                <Link
                    href={`/messages?to=${member._id}`}
                    className="btn-purple btn-square btn-small cursor-pointer"
                    type="submit"
                >
                    <Icon name="send" />
                </Link>
            </td>
        </tr>
    );
};

export default Row;
