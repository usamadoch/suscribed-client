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
    buttonClass = ""
}: ReadMoreProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!children) return null;

    const text = children;
    const wordsArray = text.trim().split(/\s+/);
    const shouldTruncate = wordsArray.length > words;

    const truncatedText = shouldTruncate
        ? wordsArray.slice(0, words).join(" ") + "..."
        : text;

    return (
        <span className={className}>
            {isExpanded || !shouldTruncate ? text : truncatedText}
            {shouldTruncate && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className={twMerge(
                        "inline-block ml-1 font-bold text-n-1 dark:text-white hover:text-purple-1 cursor-pointer",
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
