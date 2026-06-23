import Modal from "@/components/Modal";
import { useState } from "react";

type TimeoutUserModalProps = {
    visible: boolean;
    onClose: () => void;
    onTimeout: (duration: number) => void;
    isPending: boolean;
    userName?: string;
};

const TIMEOUT_OPTIONS = [
    { label: "1 minute", value: 1 },
    { label: "5 minutes", value: 5 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "24 hours", value: 24 * 60 },
];

const TimeoutUserModal = ({
    visible,
    onClose,
    onTimeout,
    isPending,
    userName,
}: TimeoutUserModalProps) => {
    return (
        <Modal
            title={`Timeout ${userName ? `@${userName}` : "User"}`}
            visible={visible}
            onClose={onClose}
        >
            <div className="text-base text-n-3 dark:text-n-8 mb-5">
                Select how long you want to timeout this user from the live chat.
            </div>
            <div className="flex flex-col gap-2">
                {TIMEOUT_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className="btn btn-stroke btn-medium w-full text-left justify-start disabled:opacity-50"
                        onClick={() => {
                            onTimeout(option.value);
                            onClose();
                        }}
                        disabled={isPending}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <div className="pt-5 flex justify-end">
                <button
                    type="button"
                    className="flex-1 btn-stroke px-5 btn-medium cursor-pointer"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default TimeoutUserModal;
