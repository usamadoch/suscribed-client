import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow, format, subDays } from "date-fns";

import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Empty from "@/components/Empty";
import {
    useAnalyticsOverview,
    useAnalyticsMembers
} from "@/hooks/useQueries";

import Statistics, { StatisticsItem } from "./Statistics";
import SimpleChart from "./SimpleChart";
import { TimeRange, TimeRangeOption } from "./types";

interface MembershipTabProps {
    days: TimeRange;
    timeRange: TimeRangeOption;
    onTimeRangeChange: (value: TimeRangeOption) => void;
    timeRangeOptions: TimeRangeOption[];
}

const MembershipTab = ({ days, timeRange, onTimeRangeChange, timeRangeOptions }: MembershipTabProps) => {
    const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview(days);
    const { data: members, isLoading: membersLoading } = useAnalyticsMembers(days);

    // const isLoading = overviewLoading || membersLoading;

    // Transform daily growth data for chart
    const chartData = useMemo(() => {
        if (!members?.dailyGrowth) return [];
        return members.dailyGrowth.map(d => ({
            date: d._id,
            value: d.count,
        }));
    }, [members?.dailyGrowth]);

    // Fill in missing dates
    const filledChartData = useMemo(() => {
        const result: Array<{ date: string; value: number }> = [];
        const dataMap = new Map(chartData.map(d => [d.date, d.value]));

        for (let i = days - 1; i >= 0; i--) {
            const date = format(subDays(new Date(), i), "yyyy-MM-dd");
            result.push({
                date,
                value: dataMap.get(date) || 0,
            });
        }
        return result;
    }, [chartData, days]);

    // Generate statistics data for the Statistics component
    const statisticsData: StatisticsItem[] = useMemo(() => {
        const defaultParams = [40, 54, 30, 70, 45, 60, 35];

        // Use chartData for members if available
        const membersParams = filledChartData.length > 0
            ? filledChartData.map(d => Math.min(Math.max((d.value / (Math.max(...filledChartData.map(x => x.value)) || 1)) * 100, 10), 100)).slice(-7)
            : defaultParams;

        return [
            {
                id: "0",
                title: "Active Members",
                value: (overview?.totalMembers || 0).toLocaleString(),
                percent: overview?.memberGrowth || 0,
                color: "#A0E63C", // Light green/lime
                parameters: membersParams.length >= 7 ? membersParams : defaultParams,
            },
            {
                id: "1",
                title: "New Joins",
                value: (overview?.newMembers || 0).toLocaleString(),
                percent: overview?.memberGrowth || 0,
                color: "#E9967A", // Salmon/Pinkish
                parameters: defaultParams,
            },
            {
                id: "2",
                title: "Cancellations",
                value: "0",
                percent: 0,
                color: "#FFD700", // Gold
                parameters: defaultParams,
            }
        ];
    }, [overview, filledChartData]);

    // if (isLoading) {
    //     return <LoadingSpinner />;
    // }

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            {overviewLoading ? <LoadingSpinner /> : (
                <Statistics
                    items={statisticsData}
                    timeRangeValue={timeRange}
                    onTimeRangeChange={onTimeRangeChange}
                    timeRangeOptions={timeRangeOptions}
                />
            )}

            {/* Growth Chart */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-n-1 dark:text-white mb-4">
                    Membership Growth
                </h3>
                <div className="bg-n-7 dark:bg-white/5 rounded-xl p-4">
                    <SimpleChart data={filledChartData} height={200} />
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-n-4">
                        <span>{format(subDays(new Date(), days - 1), "MMM d")}</span>
                        <span>{format(new Date(), "MMM d")}</span>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default MembershipTab;
