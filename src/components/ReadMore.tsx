import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ReadMoreProps {
    children: string;
    words?: number;
    className?: string; // Class for the wrapper
    buttonClass?: string; // Class for the button
    blurClass?: string; // Class for the gradient blur
}

const ReadMore = ({
    children,
    words = 30,
    className = "",
    buttonClass = "",
    blurClass = "bg-linear-to-r from-transparent to-white dark:to-n-4"
}: ReadMoreProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!children) return null;

    const text = children;
    const wordsArray = text.trim().split(/\s+/);
    const shouldTruncate = wordsArray.length > words;

    const truncatedText = shouldTruncate
        ? wordsArray.slice(0, words).join(" ")
        : text;

    return (
        <span className={twMerge("relative", className)}>
            {isExpanded || !shouldTruncate ? text : truncatedText}
            {shouldTruncate && (
                <span className="relative inline-flex items-center ml-1">
                    {!isExpanded && (
                        <span className={twMerge("absolute right-full top-0 bottom-0 w-24 pointer-events-none", blurClass)} />
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={twMerge(
                            "relative z-1 font-bold text-purple-1 dark:text-n-9 hover:text-purple-1 cursor-pointer whitespace-nowrap",
                            buttonClass
                        )}
                    >
                        {isExpanded ? "See less" : "See more"}
                    </button>
                </span>
            )}
        </span>
    );
};

export default ReadMore;
