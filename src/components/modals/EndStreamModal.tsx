import Modal from "@/components/Modal";

type EndStreamModalProps = {
    visible: boolean;
    onClose: () => void;
    onEnd: () => void;
    isPending: boolean;
};

const EndStreamModal = ({
    visible,
    onClose,
    onEnd,
    isPending,
}: EndStreamModalProps) => {
    return (
        <Modal
            title="End Stream"
            visible={visible}
            onClose={onClose}
            showCloseIcon={false}
        >
            <div className="text-base text-n-3 dark:text-n-8">
                Are you sure you want to end this live stream? This action cannot be undone.
            </div>
            <div className="pt-5 flex justify-end gap-3">
                <button
                    type="button"
                    className="flex-1 btn-stroke px-5 btn-medium cursor-pointer"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </button>

                <button
                    className="flex-1 btn-purple btn-medium dark:bg-red-500 cursor-pointer px-5"
                    onClick={onEnd}
                    disabled={isPending}
                >
                    {isPending ? "Ending..." : "End Stream"}
                </button>
            </div>
        </Modal>
    );
};

export default EndStreamModal;
