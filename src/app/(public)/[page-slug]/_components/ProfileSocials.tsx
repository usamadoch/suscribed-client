import React, { useState } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { getSocialIcon } from "@/lib/utils";
import { CreatorPage } from "@/types";

type ProfileSocialsProps = {
    socialLinks: NonNullable<CreatorPage["socialLinks"]>;
};

const ProfileSocials = ({ socialLinks }: ProfileSocialsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!socialLinks || socialLinks.length === 0) return null;

    const shouldTruncate = socialLinks.length > 3;
    const displayedLinks = !isExpanded && shouldTruncate
        ? socialLinks.slice(0, 3)
        : socialLinks;

    return (
        <div className="flex items-center mr-8 space-x-5 md:mr-4 md:space-x-3">
            {displayedLinks.map((link, index) => {
                const iconPath = getSocialIcon(link.platform);

                return (
                    <Link
                        key={index}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        className="group relative shrink-0"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {iconPath ? (
                            <div className="relative w-7 h-7 shadow-primary-4 rounded-full transition-shadow duration-100 group-hover:shadow-none">
                                <Image
                                    src={iconPath}
                                    fill
                                    alt={link.platform}
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <Icon
                                className="w-5 h-5 fill-n-4 transition-colors group-hover:fill-purple-1 dark:fill-n-3"
                                name={link.platform === 'website' ? 'link' : link.platform}
                            />
                        )}
                    </Link>
                );
            })}
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-block ml-1 font-semibold text-purple-1 dark:text-white cursor-pointer text-sm"
                >
                    {isExpanded ? "Less" : "More"}
                </button>
            )}
        </div>
    );
};

export default ProfileSocials;
