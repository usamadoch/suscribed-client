import Modal from "@/components/Modal";
import Field from "@/components/Field";
import Loader from "@/components/Loader";
import { Tier } from "@/types";

type ChangePriceModalProps = {
    visible: boolean;
    onClose: () => void;
    plan: Tier | undefined;
    newPrice: number | string;
    setNewPrice: (v: number) => void;
    onUpdate: () => void;
    isUpdatingPrice: boolean;
};

const ChangePriceModal = ({
    visible,
    onClose,
    plan,
    newPrice,
    setNewPrice,
    onUpdate,
    isUpdatingPrice,
}: ChangePriceModalProps) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Change Tier Price"
            showCloseIcon={false}
        >
            <div className="space-y-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-n-3 dark:text-n-4">Current Price</span>
                        <span className="text-h6 font-medium">{plan?.price || 0}</span>
                    </div>

                    <Field
                        label="New Monthly Price (PKR)"
                        type="number"
                        classInput='h-12'
                        value={newPrice.toString()}
                        onChange={(e: any) => setNewPrice(Number(e.target.value))}
                        autoFocus
                    />
                </div>

                <div className="p-4 bg-purple-1/10 rounded-xl border border-purple-1/30">
                    <h5 className="text-sm font-bold text-n-1 dark:text-white mb-1">Important</h5>
                    <p className="text-sm text-n-3 dark:text-n-4">
                        The new price will only apply to new subscribers. Existing subscribers will continue to pay the original price.
                    </p>
                </div>

                <div className="flex justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-stroke btn-medium flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onUpdate}
                        className="btn-purple btn-medium flex-1"
                        disabled={isUpdatingPrice}
                    >
                        {isUpdatingPrice ? <Loader /> : "Update Price"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePriceModal;
