"use client";

import { useState } from "react";

import Layout from "@/layout";
import Tabs from "@/components/Tabs";

import { RequireCreator } from "@/store/auth";
import { useHydrated } from "@/hooks/useHydrated";

import MembershipTab from "./MembershipTab";
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
    const [activeTab, setActiveTab] = useState<TabValue>("membership");
    const [timeRange, setTimeRange] = useState(timeRangeOptions[1]);

    const tabs = [
        { title: "Membership", value: "membership" },
        { title: "Post Performance", value: "posts" },
        { title: "Earnings", value: "earnings" },
    ];

    // if (!mounted) return null;

    return (
        <RequireCreator>
            <Layout title="Analytics">
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
                {activeTab === "membership" && (
                    <MembershipTab
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
            </Layout>
        </RequireCreator>
    );
};

export default AnalyticsPage;