import Icon from "@/components/Icon";

const CaughtUpMessage = () => (
    <div className="card p-8 text-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="check-circle" className="w-8 h-8 fill-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-n-1 dark:text-white">
                You&apos;re all caught up
            </h3>
            <p className="text-sm text-n-3">
                You&apos;ve seen all the latest posts from your creators. Check back later!
            </p>
        </div>
    </div>
);

export default CaughtUpMessage;
