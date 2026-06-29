import { useState, useRef, useEffect, RefObject } from "react";

export function useEmojiPicker(
    inputRef: RefObject<HTMLTextAreaElement | null>,
    value: string,
    onChange: (newValue: string) => void
) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onEmojiSelect = (emoji: any) => {
        if (inputRef.current) {
            const cursorPosition = inputRef.current.selectionStart;
            const textBeforeCursor = value.substring(0, cursorPosition);
            const textAfterCursor = value.substring(cursorPosition);
            const newValue = textBeforeCursor + emoji.native + textAfterCursor;

            onChange(newValue);

            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(
                    cursorPosition + emoji.native.length,
                    cursorPosition + emoji.native.length
                );
            }, 0);
        } else {
            onChange(value + emoji.native);
        }
    };

    return {
        showEmojiPicker,
        setShowEmojiPicker,
        emojiPickerRef,
        emojiButtonRef,
        onEmojiSelect,
    };
}
