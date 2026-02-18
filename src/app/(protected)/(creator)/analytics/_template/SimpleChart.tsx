import { useMemo } from "react";

interface SimpleChartProps {
    data: Array<{ date: string; value: number }>;
    height?: number;
    color?: string;
}

const SimpleChart = ({ data, height = 120, color = "#8B5CF6" }: SimpleChartProps) => {
    const chartData = useMemo(() => {
        if (data.length === 0) return { points: "", max: 0, min: 0 };

        const values = data.map(d => d.value);
        const max = Math.max(...values, 1);
        const min = Math.min(...values, 0);
        const range = max - min || 1;

        const width = 100;
        const points = data.map((d, i) => {
            const x = (i / Math.max(data.length - 1, 1)) * width;
            const y = height - ((d.value - min) / range) * (height - 20);
            return `${x},${y}`;
        }).join(" ");

        return { points, max, min };
    }, [data, height]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-n-4">
                <span>No data available</span>
            </div>
        );
    }

    return (
        <div className="relative" style={{ height }}>
            <svg
                viewBox={`0 0 100 ${height}`}
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                {/* Gradient fill */}
                <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area */}
                <path
                    d={`M0,${height} L${chartData.points} L100,${height} Z`}
                    fill="url(#chartGradient)"
                />

                {/* Line */}
                <polyline
                    points={chartData.points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
};

export default SimpleChart;
