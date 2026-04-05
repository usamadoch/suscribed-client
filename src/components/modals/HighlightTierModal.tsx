import Modal from "@/components/Modal";
import Select from "@/components/Select";

type HighlightTierModalProps = {
    visible: boolean;
    onClose: () => void;
    plans: any[];
    selectedTier: { id: string, title: string } | null;
    setSelectedTier: (v: { id: string, title: string } | null) => void;
    onSave: () => void;
    isUpdating: boolean;
};

const HighlightTierModal = ({
    visible,
    onClose,
    plans,
    selectedTier,
    setSelectedTier,
    onSave,
    isUpdating,
}: HighlightTierModalProps) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Highlight a Tier"
            classWrap=" border border-n-1"
            showCloseIcon={false}
        >
            <div className="space-y-5">
                <Select
                    label="Select Highlighted Tier"
                    items={plans.map(p => ({ id: p._id, title: p.name }))}
                    value={selectedTier}
                    onChange={setSelectedTier}
                    classButton='h-12'
                    placeholder="Choose a tier..."
                />
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-stroke btn-medium min-w-[100px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selectedTier || isUpdating}
                        onClick={onSave}
                        className="btn-purple btn-medium min-w-[100px] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default HighlightTierModal;
