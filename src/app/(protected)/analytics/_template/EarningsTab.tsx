import Icon from "@/components/Icon";

const EarningsTab = () => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-purple-1/10 flex items-center justify-center mb-6">
            <Icon name="money-in" className="w-10 h-10 fill-purple-1" />
        </div>
        <h2 className="text-2xl font-bold text-n-1 dark:text-white mb-3">
            Earnings Analytics Coming Soon
        </h2>
        <p className="text-n-4 text-center max-w-md mb-8">
            We&apos;re building tools to help you track your income, payouts, and supporter contributions.
        </p>
        <button
            className="btn-stroke-light inline-flex items-center gap-2"
            onClick={() => alert("Thanks for your interest! We'll notify you when this feature launches.")}
        >
            <Icon name="notification" className="w-4 h-4" />
            <span>Notify Me When Available</span>
        </button>
    </div>
);

export default EarningsTab;
