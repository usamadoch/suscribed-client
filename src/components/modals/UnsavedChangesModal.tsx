import Modal from "@/components/Modal";

type UnsavedChangesModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const UnsavedChangesModal = ({
    visible,
    onClose,
    onConfirm,
}: UnsavedChangesModalProps) => {
    return (
        <Modal
            title="Unsaved Changes"
            visible={visible}
            onClose={onClose}
        >
            <div className="text-n-1 dark:text-white mb-8">
                Are you sure you want to leave this page? Your changes will not be saved.
            </div>
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="flex-1 btn-stroke px-5 btn-medium cursor-pointer"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    className="btn-purple btn-medium cursor-pointer flex-1"
                    onClick={onConfirm}
                >
                    OK
                </button>
            </div>
        </Modal>
    );
};

export default UnsavedChangesModal;
