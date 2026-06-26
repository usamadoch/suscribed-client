
import Link from "next/link";
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
                <svg
                    className="w-6 h-6 transition-colors dark:text-[#ff0033]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            </Link>
        </div>
    );
};

export default ProfileSocials;
