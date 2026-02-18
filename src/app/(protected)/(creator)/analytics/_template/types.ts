import { TimeRange } from "@/lib/types";

export type { TimeRange };
export type TabValue = "membership" | "posts" | "earnings";

export interface TimeRangeOption {
    id: string;
    title: string;
    value: TimeRange;
}
