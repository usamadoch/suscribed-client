"use client";

import { useState } from "react";

import { useHeader } from "@/context/HeaderContext";
import Tabs from "@/components/Tabs";

import MemberTab from "./MemberTab";
import PostsTab from "./PostsTab";
import EarningsTab from "./EarningsTab";
import { TimeRange, TabValue } from "./types";

// ======================
// MAIN ANALYTICS PAGE
// ======================
const timeRangeOptions = [
    { id: "7", title: "Last 7 days", value: 7 as TimeRange },
    { id: "30", title: "Last 30 days", value: 30 as TimeRange },
    { id: "90", title: "Last 90 days", value: 90 as TimeRange },
];

const AnalyticsPage = () => {
    useHeader({ title: "Analytics" });
    // const { mounted } = useHydrated();
    const [activeTab, setActiveTab] = useState<TabValue>("member");
    const [timeRange, setTimeRange] = useState(timeRangeOptions[1]);

    const tabs = [
        { title: "Member", value: "member" },
        { title: "Post Performance", value: "posts" },
        { title: "Earnings", value: "earnings" },
    ];

    // if (!mounted) return null;

    return (
        <>

            {/* <div className="max-w-[90rem]"> */}
            {/* Header with Tabs and Time Range */}
            {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"> */}
            <Tabs
                items={tabs}
                value={activeTab}
                setValue={(value) => setActiveTab(value as TabValue)}
                className="flex-wrap!"
                classButton={activeTab === "earnings" ? "!opacity-60" : ""}
            />

            {/* Tab Content */}
            {activeTab === "member" && (
                <MemberTab
                    days={timeRange.value}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    timeRangeOptions={timeRangeOptions}
                />
            )}
            {activeTab === "posts" && (
                <PostsTab
                    days={timeRange.value}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    timeRangeOptions={timeRangeOptions}
                />
            )}
            {activeTab === "earnings" && <EarningsTab />}

            {/* </div> */}

        </>
    );
};

export default AnalyticsPage;