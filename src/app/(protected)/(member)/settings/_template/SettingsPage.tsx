"use client"

import { useState } from "react";

import Security from "./sections/Security";
import SocialNetworks from "./sections/SocialNetworks";
import Notifications from "./sections/Notifications";
import MemberAccount from "./sections/MemberAccount";
import CreatorAccount from "./sections/CreatorAccount";

import { usePermission } from "@/hooks/usePermission";

import { useHeader } from "@/context/HeaderContext";

import Tabs from "@/components/Tabs";

const SettingsTabValues = {
    Account: "account",
    Security: "security",
    SocialNetworks: "social-networks",
    Notifications: "notifications",
} as const;

type SettingsTab = typeof SettingsTabValues[keyof typeof SettingsTabValues];

const SettingsPage = () => {
    useHeader({ title: "Profile Settings" });
    const canManagePage = usePermission('page:manage');
    const canManageSecurity = usePermission('security:manage');

    const [type, setType] = useState<SettingsTab>("account");

    const allTypes: { title: string; value: SettingsTab }[] = [
        {
            title: "Account",
            value: "account",
        },
        {
            title: "Security",
            value: "security",
        },
        {
            title: "Social Networks",
            value: "social-networks",
        },

        {
            title: "Notifications",
            value: "notifications",
        },
    ];

    const types = allTypes.filter(item => {
        // Social networks specifically for page management
        if (item.value === 'social-networks' && !canManagePage) {
            return false;
        }

        // Security specifically for members (per current logic)
        // If creators should also have it, we would add the permission to them.
        if (item.value === 'security' && !canManageSecurity) {
            return false;
        }

        return true;
    });

    return (
        <>
            <div className="flex pt-4 lg:block">
                {/* <div className="shrink-0 w-[20rem] 4xl:w-[14.7rem] lg:w-full lg:mb-8">
                    <Profile />
                </div> */}
                <div className="w-[calc(100%-20rem)] pl-[6.625rem] 4xl:w-[calc(100%-14.7rem)] 2xl:pl-10 lg:w-full lg:pl-0">
                    <div className="flex justify-between mb-6 md:overflow-auto md:-mx-5 md:scrollbar-none md:before:w-5 md:before:shrink-0 md:after:w-5 md:after:shrink-0">
                        <Tabs
                            className="2xl:ml-0 md:flex-nowrap"
                            classButton="2xl:ml-0 md:whitespace-nowrap"
                            items={types}
                            value={type}
                            setValue={(val) => setType(val as SettingsTab)}
                        />
                        {/* <button className="btn-stroke btn-small shrink-0 min-w-[6rem] ml-4 md:hidden">
                            <Icon name="dots" />
                            <span>Actions</span>
                        </button> */}
                    </div>
                    {type === "account" && (canManagePage ? <CreatorAccount /> : <MemberAccount />)}
                    {type === "security" && canManageSecurity && <Security />}
                    {type === "social-networks" && canManagePage && <SocialNetworks />}
                    {type === "notifications" && <Notifications />}
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
