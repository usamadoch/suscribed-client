import Icon from "@/components/Icon";

interface MetricCardProps {
    label: string;
    value: string | number;
    subLabel?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    icon?: string;
    className?: string;
}

const MetricCard = ({ label, value, subLabel, trend, trendValue, icon, className = "" }: MetricCardProps) => (
    <div className={`bg-n-7 dark:bg-white/5 rounded-2xl p-5 ${className}`}>
        <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-n-4">{label}</span>
            {icon && <Icon name={icon} className="w-5 h-5 fill-purple-1" />}
        </div>
        <div className="text-3xl font-bold text-n-1 dark:text-white mb-1">{value}</div>
        <div className="flex items-center gap-2">
            {trend && trendValue && (
                <span className={`flex items-center gap-1 text-sm font-medium ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-n-4"
                    }`}>
                    {trend !== "neutral" && (
                        <Icon name={trend === "up" ? "progress-up" : "progress-down"} className="w-4 h-4" />
                    )}
                    {trendValue}
                </span>
            )}
            {subLabel && <span className="text-sm text-n-4">{subLabel}</span>}
        </div>
    </div>
);

export default MetricCard;
