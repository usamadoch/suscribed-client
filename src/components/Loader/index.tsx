import { twMerge } from "tailwind-merge";

type LoaderProps = {
    className?: string;
    text?: string;
    textClassName?: string;
};

const Loader = ({ className, text, textClassName }: LoaderProps) => {
    return (
        <div className={twMerge("inline-flex items-center gap-2", !text && "contents")}>
            <svg
                className={twMerge("h-4.5 w-4.5 animate-spin text-n-1 dark:text-white", className)}
                viewBox="0 0 100 100"
            >
                <circle
                    fill="none"
                    strokeWidth="8"
                    className="stroke-current opacity-40"
                    cx="50"
                    cy="50"
                    r="40"
                />
                <circle
                    fill="none"
                    strokeWidth="8"
                    className="stroke-current"
                    strokeDasharray="270"
                    strokeDashoffset="210"
                    cx="50"
                    cy="50"
                    r="40"
                />
            </svg>

            {text && (
                <p className={twMerge("text-sm text-n-1 dark:text-white", textClassName)}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loader;
