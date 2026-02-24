type ChatSkeletonProps = {
    visible: boolean;
};

const ChatSkeleton = ({ visible }: ChatSkeletonProps) => (
    <div
        className={`flex flex-col grow lg:fixed lg:inset-0 lg:z-100 lg:bg-white lg:transition-opacity dark:bg-n-1 ${visible
                ? "lg:visible lg:opacity-100"
                : "lg:invisible lg:opacity-0"
            }`}
    >
        <div className="flex mb-5 p-5 border-b border-n-1 dark:border-white">
            <div className="btn-stroke btn-square btn-small hidden mr-2 lg:block animate-skeleton bg-n-4/10" />
            <div className="flex items-center mx-auto pl-12 pr-2 text-sm font-bold lg:px-3">
                <div className="w-6 h-6 border mr-2 border-n-1 rounded-full animate-skeleton bg-n-4/10" />
                <div className="w-20 h-4 border border-n-1 animate-skeleton bg-n-4/10" />
            </div>
            <div className="btn-stroke btn-square btn-small animate-skeleton bg-n-4/10" />
        </div>
        <div className="grow px-5 space-y-4 overflow-auto" />
    </div>
);

export default ChatSkeleton;
