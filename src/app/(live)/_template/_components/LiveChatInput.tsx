"use client";

import { useState, useRef, useEffect } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from "react-hot-toast";

import Icon from "@/components/Icon";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/modals/LoginModal";
import CommentInput from "@/components/Comment";
import Alert from "@/components/Alert";
import { liveApi } from "@/services/live.service";
import SuperChatModal from "./SuperChatModal";
import { useMyPage } from "@/hooks/queries";



interface LiveChatInputProps {
    sessionId?: string;
    isLive?: boolean;
    mutedUntil?: Date | null;
    isCreator?: boolean;
}

export default function LiveChatInput({ sessionId, isLive, mutedUntil, isCreator }: LiveChatInputProps) {
    const { isAuthenticated, user } = useAuth();
    const { data: myPage } = useMyPage();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSuperChatModal, setShowSuperChatModal] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [muteRemaining, setMuteRemaining] = useState<string | null>(null);

    useEffect(() => {
        if (!mutedUntil) {
            setMuteRemaining(null);
            return;
        }
        
        const updateMute = () => {
            const now = new Date();
            if (mutedUntil <= now) {
                setMuteRemaining(null);
            } else {
                const diffMs = mutedUntil.getTime() - now.getTime();
                const mins = Math.floor(diffMs / 60000);
                const secs = Math.floor((diffMs % 60000) / 1000);
                setMuteRemaining(`${mins > 0 ? `${mins}m ` : ''}${secs}s`);
            }
        };

        updateMute();
        const interval = setInterval(updateMute, 1000);
        return () => clearInterval(interval);
    }, [mutedUntil]);

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

    const [messageText, setMessageText] = useState("");
    const maxLength = 196;

    const onEmojiSelect = (emoji: any) => {
        if (inputRef.current) {
            const cursorPosition = inputRef.current.selectionStart;
            const textBeforeCursor = messageText.substring(0, cursorPosition);
            const textAfterCursor = messageText.substring(cursorPosition);
            const newMessage = textBeforeCursor + emoji.native + textAfterCursor;
            setMessageText(newMessage);

            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(
                    cursorPosition + emoji.native.length,
                    cursorPosition + emoji.native.length
                );
            }, 0);
        } else {
            setMessageText(messageText + emoji.native);
        }
    };
    const currentLength = messageText?.length || 0;
    const remainingLength = Math.max(0, maxLength - currentLength);
    const percentageRemaining = (remainingLength / maxLength) * 100;
    const isCloseToLimit = remainingLength <= 20;

    const onSubmit = async () => {
        if (!messageText.trim()) return;

        if (!isLive) {
            return;
        }

        if (!sessionId) return;

        setIsSending(true);
        try {
            await liveApi.sendChatMessage(sessionId, messageText.trim());
            setMessageText("");
        } catch (error: any) {
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="error"
                    message={error?.message || "Failed to send message"}
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        } finally {
            setIsSending(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <>
                <div className="shrink-0 pt-4 border-t border-n-4 dark:border-n-6 px-5">
                    <button
                        className="btn btn-purple btn-medium w-full h-10"
                        onClick={() => setShowLoginModal(true)}
                    >
                        Sign in to chat
                    </button>
                    <div className="text-center text-xs font-medium text-n-7 mt-3">
                        All messages you send will appear publicly
                    </div>
                </div>
                <LoginModal
                    visible={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            </>
        );
    }

    return (
        <div className="relative shrink-0 pt-4 border-t border-n-4 dark:border-n-6 pb-2">
            {showEmojiPicker && (
                <div className="absolute bottom-[calc(100%-0.5rem)] right-0 z-50 live-chat-emoji-picker" ref={emojiPickerRef}>
                    <style>{`
                        .live-chat-emoji-picker em-emoji-picker {
                            --em-picker-width: 360px;
                            width: 360px;
                        }
                    `}</style>
                    <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" previewPosition="none" />
                </div>
            )}


            <SuperChatModal
                visible={showSuperChatModal}
                onClose={() => setShowSuperChatModal(false)}
                sessionId={sessionId}
            />

            <div className="px-5">

                <CommentInput
                    inputRef={inputRef}
                    avatar={messageText?.trim() ? (isCreator ? (myPage?.avatarUrl || user?.avatarUrl || "/images/avatars/avatar.jpg") : (user?.avatarUrl || "/images/avatars/avatar.jpg")) : null}
                    placeholder={isLive ? "Chat..." : "Chat is closed"}
                    overlayNode={
                        muteRemaining ? (
                            <span>
                                You're in timeout &mdash; <span className="font-bold text-purple-1">{muteRemaining}</span> remaining
                            </span>
                        ) : undefined
                    }
                    value={messageText}
                    setValue={(e) => {
                        setMessageText(e.target.value);
                    }}
                    onSend={onSubmit}
                    disabled={!isLive || isSending || !!muteRemaining}
                    inputDisabled={!isLive || !!muteRemaining}
                    progress={percentageRemaining}
                    progressColor={isCloseToLimit ? 'bg-pink-1' : 'bg-purple-1'}
                    maxLength={maxLength}

                    button={
                        <div className="flex items-center shrink-0 h-13.5 gap-2">
                            <button
                                ref={emojiButtonRef}
                                type="button"
                                className={`btn btn-stroke btn-square h-8 w-8 bg-n-3 rounded-md ${(!isLive || !!muteRemaining) ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                disabled={!isLive || !!muteRemaining}
                            >
                                <Icon className="icon-20 fill-currentColor" name="smile" />
                            </button>
                            {!messageText?.trim() ? (
                                <button
                                    type="button" 
                                    className={`btn btn-stroke btn-square h-8 w-8 bg-n-3 rounded-md ${(!isLive || !!muteRemaining) ? "opacity-50 cursor-not-allowed" : ""}`} 
                                    onClick={() => setShowSuperChatModal(true)}
                                    disabled={!isLive || !!muteRemaining}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    className={`btn-purple btn-square btn-small ${(!isLive || isSending || !!muteRemaining) ? "opacity-50 cursor-not-allowed" : ""}`}
                                    type="submit"
                                    disabled={!isLive || isSending || !!muteRemaining}
                                >
                                    <Icon name="send" />
                                </button>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
