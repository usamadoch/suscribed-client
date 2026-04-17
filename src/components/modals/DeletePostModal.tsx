import Modal from "@/components/Modal";

type DeletePostModalProps = {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    isPending: boolean;
};

const DeletePostModal = ({
    visible,
    onClose,
    onDelete,
    isPending,
}: DeletePostModalProps) => {
    return (
        <Modal
            title="Delete Post"
            visible={visible}
            onClose={onClose}
            showCloseIcon={false}
        >
            <div className="text-base text-n-3 dark:text-n-8">
                Are you sure you want to delete this post? This action cannot be undone.
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
                    onClick={onDelete}
                    disabled={isPending}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default DeletePostModal;
