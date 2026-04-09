"use client";

import { useState } from "react";

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
            <Tabs
                items={tabs}
                value={activeTab}
                setValue={(value) => setActiveTab(value as TabValue)}
                className="flex-wrap!"
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

        </>
    );
};

export default AnalyticsPage;