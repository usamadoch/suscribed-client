import React from "react";
import Link from "next/link";
import Image from "@/components/Image";
import LiveBadge from "@/components/LiveBadge";
import { formatAppDate } from "@/lib/date";

export interface ContentHeaderProps {
    creator: {
        displayName: string;
        avatarUrl?: string | null;
    };
    date?: string | Date | null;
    locked?: boolean;
    titleOrCaption: React.ReactNode;
    badges?: React.ReactNode;
    actions?: React.ReactNode;
    metadata?: React.ReactNode;
    activeLiveSessionId?: string | null;
}

const ContentHeader = ({
    creator,
    date,
    locked = false,
    titleOrCaption,
    badges,
    actions,
    metadata,
    activeLiveSessionId,
}: ContentHeaderProps) => {
    return (
        <div className="max-w-4xl mx-auto p-5 pt-0">
            <div className="flex flex-col items-start justify-between w-full">
                <div className="flex items-start w-full">
                    {/* Avatar Section */}
                    <div className={`relative shrink-0 w-16 h-16 mb-3 rounded-full bg-n-1 ${!activeLiveSessionId ? 'shadow-primary-4' : ''}`}>
                        {activeLiveSessionId && <LiveBadge />}
                        {activeLiveSessionId ? (
                            <Link href={`/live-room/${activeLiveSessionId}`} className="block w-full h-full relative rounded-full overflow-hidden cursor-pointer border-2 border-red-500">
                                <Image
                                    className="object-cover"
                                    slot="profile"
                                    family="avatar"
                                    src={creator.avatarUrl}
                                    fill
                                    alt={creator.displayName}
                                />
                            </Link>
                        ) : (
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    className="object-cover"
                                    slot="profile"
                                    family="avatar"
                                    src={creator.avatarUrl}
                                    fill
                                    alt={creator.displayName}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full pl-4 gap-2">
                        <div className="flex justify-between w-full">
                            <div className="flex items-center gap-3">
                                <h5 className="capitalize text-h5 md:text-h4 dark:text-n-9">{creator.displayName}</h5>
                                {date && (
                                    <div className="flex items-center gap-3 ">
                                        <span className="dark:text-n-8">•</span>
                                        <span className="text-sm text-n-3 dark:text-n-8">
                                            {formatAppDate(date, { suffix: true })}
                                        </span>
                                    </div>
                                )}
                                {badges}
                            </div>
                            {actions && (
                                <div className="mt-0 ml-auto mobile:hidden">
                                    {actions}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-start w-full">
                            <div className={`text-sm whitespace-pre-wrap text-n-1 dark:text-n-9 w-[60%] ${locked ? "blur-xs select-none" : ""}`}>
                                {titleOrCaption}
                            </div>
                            {metadata && (
                                <div className="shrink-0 mobile:hidden">
                                    {metadata}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile version for actions/metadata */}
                {(actions || metadata) && (
                    <div className="hidden mobile:flex pt-4 justify-between items-center w-full">
                        {actions && (
                            <div className="flex items-center gap-3 ml-2">
                                {actions}
                            </div>
                        )}
                        {metadata && (
                            <div className="shrink-0">
                                {metadata}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentHeader;
