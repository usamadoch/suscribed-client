import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { CreatorPage } from "@/types";

type ProfileSocialsProps = {
    youtube?: CreatorPage["youtube"];
};

const ProfileSocials = ({ youtube }: ProfileSocialsProps) => {
    if (!youtube || !youtube.isVerified) return null;

    return (
        <div className="flex items-center mr-8 space-x-5 md:mr-4 md:space-x-3">
            <Link
                href={`https://youtube.com/channel/${youtube.channelId}`}
                className="group relative shrink-0"
                target="_blank"
                rel="noreferrer"
            >
                <Icon
                    className="w-6 h-6 transition-colors dark:text-[#ff0033]"
                    name="youtube"
                />
            </Link>
        </div>
    );
};

export default ProfileSocials;
