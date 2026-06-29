"use client";
import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import { Icon as LucideIcon } from "@/components/ui/icon";
import { Smile } from "@/lib/icons";
import Image from "@/components/Image";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useEmojiPicker } from "@/hooks/useEmojiPicker";

type CommentProps = {
    className?: string;
    avatar?: string | null;
    placeholder: string;
    value: string;
    setValue: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSend?: () => void;
    disabled?: boolean;
    inputDisabled?: boolean; // New prop for disabling the input specifically
    button?: React.ReactNode;
    progress?: number;
    progressColor?: string;
    maxLength?: number;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
    overlayNode?: React.ReactNode;
};

const Comment = ({
    className,
    avatar,
    placeholder,
    value,
    setValue,
    onSend,
    disabled,
    inputDisabled,
    button,
    progress,
    progressColor,
    maxLength,
    inputRef,
    overlayNode,
}: CommentProps) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const activeRef = (inputRef || internalRef) as React.RefObject<HTMLTextAreaElement>;

    const {
        showEmojiPicker,
        setShowEmojiPicker,
        emojiPickerRef,
        emojiButtonRef,
        onEmojiSelect,
    } = useEmojiPicker(activeRef, value, (newVal) => {
        setValue({ target: { value: newVal } } as any);
    });

    return (
        <form
            className={`relative flex pl-1 py-1 pr-5 bg-white border border-n-1 rounded-sm shadow-primary-4 md:pr-4 dark:bg-n-1 dark:border-n-6 ${className || ""}`}
            action=""
            onSubmit={(e) => {
                e.preventDefault();
                onSend?.();
            }}
        >
            {showEmojiPicker && (
                <div className="absolute bottom-[calc(100%+0.5rem)] right-0 z-50 comment-emoji-picker" ref={emojiPickerRef}>
                    <style>{`
                        .comment-emoji-picker em-emoji-picker {
                            --em-picker-width: 320px;
                            width: 320px;
                        }
                    `}</style>
                    <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" previewPosition="none" />
                </div>
            )}
            {avatar && (
                <div className="flex items-center shrink-0 h-13.5">

                    <div className="relative  w-8 h-8 ml-4">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="profile"
                            src={avatar}
                            fill
                            alt="Avatar"
                        />
                    </div>
                </div>
            )}

            {overlayNode ? (
                <div className={`grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none md:px-3 dark:text-n-9 ${inputDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
                    {overlayNode}
                </div>
            ) : (
                <TextareaAutosize
                    ref={activeRef as any}
                    className={`grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none resize-none placeholder:text-n-1 md:px-3 dark:text-n-9 dark:placeholder:text-n-9 ${inputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    maxRows={5}
                    autoFocus
                    value={value}
                    onChange={setValue}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (value && value.trim() && !disabled && !inputDisabled) {
                                onSend?.();
                            }
                        }
                    }}
                    placeholder={placeholder}
                    required
                    disabled={inputDisabled}
                    maxLength={maxLength}
                />
            )}
            <div className="flex items-center shrink-0 h-13.5 gap-2">
                {button !== undefined ? button : (
                    <>
                        <button
                            ref={emojiButtonRef}
                            className={`btn-transparent-dark btn-square btn-small mr-1 ${disabled || inputDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            disabled={disabled || inputDisabled}
                        >
                            <LucideIcon icon={Smile} />
                        </button>
                        <button
                            className={`btn-purple btn-square btn-small ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            type="submit"
                            disabled={disabled}
                        >
                            <Icon name="send" />
                        </button>
                    </>
                )}
            </div>
            {progress !== undefined && (
                <div
                    className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${progressColor || 'bg-purple-1'}`}
                    style={{ width: `${progress}%` }}
                />
            )}
        </form>
    );
};

export default Comment;
