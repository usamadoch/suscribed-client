import { twMerge } from "tailwind-merge";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={twMerge("animate-pulse rounded-md bg-n-3/10 dark:bg-white/10", className)}
            {...props}
        />
    );
};

export { Skeleton };
