import Modal from "@/components/Modal";
import Field from "@/components/Field";
import Select from "@/components/Select";

type PerkModalProps = {
    visible: boolean;
    onClose: () => void;
    editingIndex: number | null;
    isCustomPerk: boolean;
    setIsCustomPerk: (v: boolean) => void;
    selectedPerk: { id: string, title: string } | null;
    setSelectedPerk: (v: { id: string, title: string } | null) => void;
    customPerkText: string;
    setCustomPerkText: (v: string) => void;
    onSave: (perkTitle: string) => void;
    predefinedPerks: { id: string, title: string }[];
};

const PerkModal = ({
    visible,
    onClose,
    editingIndex,
    isCustomPerk,
    setIsCustomPerk,
    selectedPerk,
    setSelectedPerk,
    customPerkText,
    setCustomPerkText,
    onSave,
    predefinedPerks,
}: PerkModalProps) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title={editingIndex !== null ? "Edit Perk" : "Add Perk"}
            showCloseIcon={false}
        >
            <div className="space-y-5">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-n-1 dark:text-n-9">
                            {isCustomPerk ? "Custom Perk" : "Select a Perk"}
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustomPerk(!isCustomPerk);
                                setSelectedPerk(null);
                                setCustomPerkText('');
                            }}
                            className="text-xs text-purple-1 font-medium cursor-pointer"
                        >
                            {isCustomPerk ? "Select predefined perk instead" : "Create custom perk"}
                        </button>
                    </div>
                    {isCustomPerk ? (
                        <Field
                            value={customPerkText}
                            classInput="h-12"
                            onChange={(e: any) => setCustomPerkText(e.target.value)}
                        />
                    ) : (
                        <Select
                            items={predefinedPerks}
                            value={selectedPerk}
                            classButton="h-12"
                            onChange={setSelectedPerk}
                            placeholder="Choose a perk..."
                            classOptions="max-h-[250px] overflow-y-auto custom-scrollbar"
                        />
                    )}
                </div>
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
                        disabled={!selectedPerk && (!isCustomPerk || !customPerkText.trim())}
                        onClick={() => {
                            const finalPerkTitle = isCustomPerk ? customPerkText.trim() : selectedPerk?.title;
                            if (finalPerkTitle) {
                                onSave(finalPerkTitle);
                            }
                        }}
                        className="btn-purple btn-medium min-w-[100px] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {editingIndex !== null ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PerkModal;
