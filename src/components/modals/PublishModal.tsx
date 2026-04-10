import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

type PublishModalProps = {
    visible: boolean;
    onClose: () => void;
    missingFields: string[];
    onPublish: () => void;
    isPending: boolean;
};

const PublishModal = ({
    visible,
    onClose,
    missingFields,
    onPublish,
    isPending,
}: PublishModalProps) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Publish Page"
            showCloseIcon={false}

        >

            <div className=" space-y-4">
                <p className="text-base text-n-2 dark:text-n-8">
                    Are you sure you want to publish your page? It will become visible to everyone.
                </p>

                {missingFields.length > 0 && (
                    <div className=" p-4 border border-n-1 shadow-primary-4 ">
                        <h6 className="text-n-2 text-h6 dark:text-purple-200 font-medium mb-2 flex items-center gap-2">
                            <span className="text-lg">⚠️</span> Complete your profile
                        </h6>
                        <p className="text-base text-n-2 dark:text-purple-300 mb-2">
                            Your page is looking a bit empty! Consider adding the following before publishing:
                        </p>
                        <ul className="list-[square] pl-5 text-sm font-medium text-n-2 dark:text-purple-300 space-y-1">
                            {missingFields.map(field => (
                                <li key={field}>{field}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 pt-4">
                    <button
                        className="btn-stroke w-full btn-medium px-10"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn-purple w-full btn-medium px-10 md:bg-transparent! md:border-none md:w-6 md:h-6 md:p-0 md:text-0"
                        onClick={onPublish}
                        disabled={isPending}
                    >
                        {isPending ? <Loader /> : 'Publish'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PublishModal;
