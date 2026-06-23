
type LiveBadgeProps = {
    className?: string;
    size?: 'sm' | 'md';
};

const LiveBadge = ({ className = "", size = "sm" }: LiveBadgeProps) => {
    const sizeClasses = {
        sm: "text-[10px] px-2 py-[2px]",
        md: "text-xs px-2.5 py-1"
    };

    return (
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 ${className}`}>
            <span
                className={`bg-red-500 text-n-9 font-bold rounded-sm uppercase tracking-wider flex items-center gap-1 shrink-0 ${sizeClasses[size]}`}>
                Live
            </span>
        </div>
    );
};

export default LiveBadge;

