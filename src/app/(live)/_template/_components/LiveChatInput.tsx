"use client";

import { useState, useRef, useEffect } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from "react-hot-toast";

import { Icon } from "@/components/ui/icon";
import { Smile, Star, Send } from "@/lib/icons";
import { useAuth } from "@/store/auth";
import LoginModal from "@/components/modals/LoginModal";
import CommentInput from "@/components/Comment";
import Alert from "@/components/Alert";
import { liveApi } from "@/services/live.service";
import SuperChatModal from "./SuperChatModal";
import { useMyPage } from "@/hooks/queries";
import { useEmojiPicker } from "@/hooks/useEmojiPicker";



interface LiveChatInputProps {
    sessionId?: string;
    isLive?: boolean;
    isLoading?: boolean;
    mutedUntil?: Date | null;
    isCreator?: boolean;
}

export default function LiveChatInput({ sessionId, isLive, isLoading, mutedUntil, isCreator }: LiveChatInputProps) {
    const { isAuthenticated, user } = useAuth();
    const { data: myPage } = useMyPage();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showSuperChatModal, setShowSuperChatModal] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [muteRemaining, setMuteRemaining] = useState<string | null>(null);
    const [messageText, setMessageText] = useState("");

    const {
        showEmojiPicker,
        setShowEmojiPicker,
        emojiPickerRef,
        emojiButtonRef,
        onEmojiSelect,
    } = useEmojiPicker(inputRef, messageText, setMessageText);

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

    const maxLength = 196;
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
                        className="btn btn-purple btn-medium rounded-sm w-full h-10"
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


            {!isCreator && (
                <SuperChatModal
                    visible={showSuperChatModal}
                    onClose={() => setShowSuperChatModal(false)}
                    sessionId={sessionId}
                />
            )}

            <div className="px-5">

                <CommentInput
                    inputRef={inputRef}
                    avatar={messageText?.trim() ? (isCreator ? (myPage?.avatarUrl || user?.avatarUrl || "/images/avatars/avatar.jpg") : (user?.avatarUrl || "/images/avatars/avatar.jpg")) : null}
                    placeholder={isLoading ? "Loading..." : (isLive ? "Chat..." : "Chat is closed")}
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
                                <Icon icon={Smile} />
                            </button>
                            {!messageText?.trim() ? (
                                !isCreator && (
                                    <button
                                        type="button"
                                        className={`btn btn-stroke btn-square h-8 w-8 bg-n-3 rounded-md ${(!isLive || !!muteRemaining) ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onClick={() => setShowSuperChatModal(true)}
                                        disabled={!isLive || !!muteRemaining}
                                    >
                                        <Icon icon={Star} />
                                    </button>
                                )
                            ) : (
                                <button
                                    className={`btn-purple btn-square btn-small ${(!isLive || isSending || !!muteRemaining) ? "opacity-50 cursor-not-allowed" : ""}`}
                                    type="submit"
                                    disabled={!isLive || isSending || !!muteRemaining}
                                >
                                    <Icon icon={Send} />
                                </button>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
