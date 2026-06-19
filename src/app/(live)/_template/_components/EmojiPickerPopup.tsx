import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Icon from "@/components/Icon";

interface EmojiPickerPopupProps {
    onEmojiSelect: (emoji: any) => void;
    canMessage: boolean;
}

export default function EmojiPickerPopup({ onEmojiSelect, canMessage }: EmojiPickerPopupProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pickerStyles, setPickerStyles] = useState<React.CSSProperties>({});
    
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

    const handleEmojiClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!showEmojiPicker && emojiButtonRef.current) {
            const rect = emojiButtonRef.current.getBoundingClientRect();
            const leftPos = rect.left > 340 ? rect.left - 336 : 16;

            setPickerStyles({
                position: 'fixed',
                bottom: window.innerHeight - rect.bottom,
                left: leftPos,
                zIndex: 999999,
            });
            setShowEmojiPicker(true);
        } else {
            setShowEmojiPicker(false);
        }
    };

    if (!canMessage) return null;

    return (
        <div className="flex justify-start px-1 mt-1 shrink-0 relative">
            <button
                ref={emojiButtonRef}
                className="hover:text-n-4 transition-colors cursor-pointer"
                onClick={handleEmojiClick}
                type="button"
            >
                <Icon name="smile" className="fill-white w-7 h-7" />
            </button>
            
            {showEmojiPicker && typeof document !== 'undefined' && createPortal(
                <div style={pickerStyles} className="live-chat-emoji-picker shadow-2xl" ref={emojiPickerRef}>
                    <style>{`
                        .live-chat-emoji-picker em-emoji-picker {
                            --em-picker-width: 320px;
                            width: 320px;
                        }
                    `}</style>
                    <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" previewPosition="none" />
                </div>,
                document.body
            )}
        </div>
    );
}
