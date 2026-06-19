"use client";

import { useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-hot-toast";
import SafepayOneTimeCheckout from "@/components/modals/SafepayOneTimeCheckout";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Modal from "@/components/Modal";
import { useAuth } from "@/store/auth";
import { useSuperChatAPI } from "@/hooks/useSuperChatAPI";
import EmojiPickerPopup from "./EmojiPickerPopup";
import SuperChatSlider from "./SuperChatSlider";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";

type SuperChatModalProps = {
    visible: boolean;
    onClose: () => void;
    sessionId?: string;
};

type SuperChatFormData = {
    amount: number;
    message: string;
};

export default function SuperChatModal({ visible, onClose, sessionId }: SuperChatModalProps) {
    const { user } = useAuth();

    const { control, handleSubmit, watch, setValue } = useForm<SuperChatFormData>({
        defaultValues: { amount: 500, message: "" }
    });

    const amount = watch("amount") || 500;
    const message = watch("message") || "";
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [checkoutData, setCheckoutData] = useState<{ trackerToken: string, authToken: string, messageId: string } | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    const { tiersData, getTier, isTiersLoading, sessionData, initiateMutation, confirmMutation } = useSuperChatAPI(sessionId);

    const PREDEFINED_AMOUNTS = useMemo(() => {
        if (!tiersData || tiersData.length === 0) return [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 40000, 50000];
        const amounts = tiersData.map((t: any) => t.minAmount).filter((a: number) => a > 0).sort((a: number, b: number) => a - b);
        if (amounts.length === 0) return [100, 200, 500, 1000, 2000, 5000];
        const max = amounts[amounts.length - 1];
        amounts.push(max + 10000, max + 20000); // add a few extra slider stops above max tier
        return Array.from(new Set(amounts)).sort((a, b) => a - b);
    }, [tiersData]);

    const tier = useMemo(() => getTier(amount), [amount, getTier]);

    const handleAmountChange = (newAmount: number) => {
        setValue("amount", newAmount);
        const newTier = getTier(newAmount);
        if (message.length > newTier.maxLength) {
            setValue("message", message.substring(0, newTier.maxLength));
        }
    };

    const onEmojiSelect = (emoji: any) => {
        if (inputRef.current) {
            const cursorPosition = inputRef.current.selectionStart;
            const textBeforeCursor = message.substring(0, cursorPosition);
            const textAfterCursor = message.substring(cursorPosition);
            const newMessage = textBeforeCursor + emoji.native + textAfterCursor;
            setValue("message", newMessage.substring(0, tier.maxLength));

            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(
                    cursorPosition + emoji.native.length,
                    cursorPosition + emoji.native.length
                );
            }, 0);
        } else {
            setValue("message", (message + emoji.native).substring(0, tier.maxLength));
        }
    };

    const onSubmit = (data: SuperChatFormData) => {
        initiateMutation.mutate(data, {
            onSuccess: (res) => setCheckoutData(res),
            onError: (err: any) => toast.error(err.message || 'Failed to initiate checkout')
        });
    };

    const handleClose = () => {
        setCheckoutData(null);
        setValue("amount", 500);
        setValue("message", "");
        onClose();
    };

    return (
        <>
            <div
                className={`absolute bottom-0 left-0 right-0 z-100 dark:bg-n-1 dark:border-t dark:border-n-6 ${visible ? "translate-y-0" : "translate-y-full pointer-events-none"}`}
                style={{ maxHeight: '85vh', display: visible ? 'flex' : 'none' }}
            >
                {isTiersLoading && visible ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <span className="text-n-4">Loading...</span>
                    </div>
                ) : (
                    <div className="w-full flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar">
                        {checkoutData ? (
                            <div className="p-4 flex items-center justify-center h-40">
                                {/* Blank area as requested */}
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 pb-3">
                                    <div className="flex items-center gap-3">
                                        <button onClick={handleClose} className="hover:text-n-4 cursor-pointer" type="button">
                                            <Icon name="close" className="fill-white w-6 h-6" />
                                        </button>
                                        <div className="text-h6 font-normal">Send a Super...</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        {tier.canMessage && (
                                            <div className="flex items-center justify-between text-xs text-n-8 px-1">
                                                <div className="flex items-center gap-1">
                                                    {tier.pinTime && (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                                                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                                            </svg>
                                                            {tier.pinTime}
                                                        </>
                                                    )}
                                                </div>
                                                <div>{message.length} /{tier.maxLength}</div>
                                            </div>
                                        )}

                                        {/* Preview Card */}
                                        <div className={`rounded-xl px-4 py-2 flex flex-col relative overflow-hidden shrink-0 transition-colors duration-300 ${!tier.canMessage ? 'mb-4' : ''}`} style={{ backgroundColor: tier.bg }}>
                                            <div className={`flex items-center gap-3 relative z-10 ${tier.canMessage ? 'mb-2' : ''}`}>
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                                    <Image
                                                        className="object-cover"
                                                        family="avatar"
                                                        slot="sidebar"
                                                        src={user?.avatarUrl || "/images/avatars/avatar-1.jpg"}
                                                        fill
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div>
                                                    <span className={`opacity-90 text-sm font-semibold transition-colors duration-300 ${tier.textDark ? 'dark:text-n-4/80' : 'dark:text-n-9'}`}>@{user?.username || "muhammadusama8630"}</span>
                                                    <span className={`text-[15px] font-semibold ml-4 transition-colors duration-300 ${tier.textDark ? 'dark:text-n-1' : 'dark:text-n-9 '}`}>Rs {amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            {tier.canMessage && (
                                                <Controller
                                                    name="message"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextareaAutosize
                                                            {...field}
                                                            ref={(e) => {
                                                                field.ref(e);
                                                                (inputRef as any).current = e;
                                                            }}
                                                            className={`w-full rounded-lg p-3 text-[15px] font-medium resize-none outline-none border-none focus:ring-0 relative z-10 custom-scrollbar transition-colors duration-300 ${tier.textDark ? 'dark:text-n-4/60 text-n-4/60 dark:placeholder-n-4/60 placeholder-n-4/60' : 'dark:text-n-9 text-n-9 placeholder-white/70 dark:placeholder-white/70'}`}
                                                            style={{ backgroundColor: tier.textareaBg }}
                                                            maxRows={5}
                                                            placeholder="Write a message..."
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value.substring(0, tier.maxLength))}
                                                        />
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <EmojiPickerPopup onEmojiSelect={onEmojiSelect} canMessage={tier.canMessage} />

                                    <SuperChatSlider
                                        control={control}
                                        amount={amount}
                                        PREDEFINED_AMOUNTS={PREDEFINED_AMOUNTS}
                                        onAmountChange={handleAmountChange}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-purple btn-medium btn-shadow mt-6"
                                        disabled={initiateMutation.isPending}
                                    >
                                        {initiateMutation.isPending ? <Loader /> : "Buy and Send"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </div>

            <Modal
                title="Complete your purchase"
                visible={!!checkoutData}
                onClose={() => setCheckoutData(null)}
                showCloseIcon={true}
                disableOutsideClick={true}
                classWrap="max-w-lg w-full p-0"
            >
                {checkoutData && (
                    <div className="flex flex-col">
                        {confirmError && (
                            <div className="px-4 pt-4 pb-0">
                                <Alert type="error" message={confirmError} onClose={() => setConfirmError(null)} />
                            </div>
                        )}
                        <SafepayOneTimeCheckout
                            amount={amount}
                            trackerToken={checkoutData.trackerToken}
                            authToken={checkoutData.authToken}
                            messageId={checkoutData.messageId}
                            sessionId={sessionId}
                            onBack={() => setCheckoutData(null)}
                            onSuccess={(data) => {
                                if (data?.isSavedCardCharge) {
                                    // toast.success('Payment successful!');
                                    handleClose();
                                } else {
                                    setConfirmError(null);
                                    confirmMutation.mutate(checkoutData.trackerToken, {
                                        onSuccess: () => handleClose(),
                                        onError: (err: any) => setConfirmError(err.message || 'Failed to confirm payment')
                                    });
                                }
                            }}
                            streamTitle={sessionData?.title}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
}
