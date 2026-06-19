import React from "react";

export const truncateMessage = (text: string, limit: number = 196) => {
    if (text.length <= limit) return text;
    const sub = text.substring(0, limit);
    const lastSpace = sub.lastIndexOf(" ");
    return lastSpace > 0 ? sub.substring(0, lastSpace) + "..." : sub + "...";
};

export const renderMessageText = (text: string) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        const segments = Array.from(segmenter.segment(text));

        const result: React.ReactNode[] = [];
        let textBuffer = "";

        segments.forEach((seg, i) => {
            const isEmoji = /\p{Extended_Pictographic}/u.test(seg.segment) || /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u.test(seg.segment);

            if (isEmoji) {
                if (textBuffer) {
                    result.push(<span key={`t-${i}`}>{textBuffer}</span>);
                    textBuffer = "";
                }
                result.push(
                    <span key={`e-${i}`} className="text-[24px] leading-none inline-block align-bottom" style={{ transform: 'translateY(1px)' }}>
                        {seg.segment}
                    </span>
                );
            } else {
                textBuffer += seg.segment;
            }
        });

        if (textBuffer) {
            result.push(<span key="end">{textBuffer}</span>);
        }

        return result;
    }

    return text;
};
