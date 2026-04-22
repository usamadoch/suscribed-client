import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ReadMoreProps {
    children: string;
    words?: number;
    className?: string; // Class for the wrapper
    buttonClass?: string; // Class for the button
}

const ReadMore = ({
    children,
    words = 30,
    className = "",
    buttonClass = "",
}: ReadMoreProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!children) return null;

    const text = children;
    const wordsArray = text.trim().split(/\s+/);
    const shouldTruncate = wordsArray.length > words;

    const truncatedText = shouldTruncate
        ? wordsArray.slice(0, words).join(" ")
        : text;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <span className={twMerge("relative", className)}>
            {isExpanded || !shouldTruncate ? text : truncatedText}
            {shouldTruncate && (
                <button
                    onClick={handleToggle}
                    className={twMerge(
                        "inline-flex items-center cursor-pointer whitespace-nowrap transition-all",
                        !isExpanded
                            ? "relative pl-8 -ml-8 bg-linear-to-r from-transparent via-white to-white dark:via-n-1 dark:to-n-1 text-purple-1 hover:text-purple-1"
                            : "ml-1 text-purple-1 hover:text-purple-1",
                        buttonClass
                    )}
                >
                    {isExpanded ? "See less" : "See more"}
                </button>
            )}
        </span>
    );
};

export default ReadMore;
