
import { CreatorPage, Tier } from "@/types";
import Icon from "@/components/Icon";

type SubscriptionSuccessProps = {
    page: CreatorPage;
    plan?: Tier;
    onViewContent: () => void;
    onBackToHome: () => void;
};

const SubscriptionSuccess = ({ page, plan, onViewContent, onBackToHome }: SubscriptionSuccessProps) => {
    const displayBenefits = plan?.benefits || [];

    return (
        <div className="relative flex flex-col items-center text-center py-10 max-w-80 mx-auto">
            {/* Animated checkmark container - kept simple without motion here */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 p-[2px] mb-8 shadow-2xl shadow-green-500/20">
                <div className="w-full h-full rounded-full bg-background dark:bg-n-4 flex items-center justify-center">
                    <Icon name="check" className="w-10 h-10 fill-green-500" />
                </div>
            </div>

            {/* Heading */}
            <h3 className="text-h4 font-bold text-n-1 dark:text-n-9 mb-2">
                You&apos;re a subscriber!
            </h3>

            <p className="text-sm text-n-3 dark:text-n-8 mb-12">
                Welcome to
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-1 to-purple-4 ml-1">
                    {page.displayName}&apos;s Page
                </span>
            </p>

            {/* What you've unlocked */}
            <div className="card px-4 py-6 w-full h-full border border-n-6 text-left">
                <h5 className="text-sm font-bold text-n-4 dark:text-n-9 capitalize mb-6">
                    What you&apos;ve got:
                </h5>
                <ul className="space-y-2 dark:text-n-8">
                    {displayBenefits.map((item, i) => (
                        <li key={item + i} className="text-sm font-medium flex items-center gap-2">
                            <Icon name="check" className="fill-purple-1" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-2 mt-6">
                <button
                    className="btn-purple btn-medium w-full"
                    onClick={onViewContent}
                >
                    View Exclusive Content
                </button>
                <button
                    className="btn-stroke btn-medium w-full"
                    onClick={onBackToHome}
                >
                    Back to Home
                </button>
            </div>

            {/* Receipt note */}
            <p className="text-sm font-medium text-n-4 dark:text-n-7 mt-8 italic">
                Receipt sent to your email
            </p>
        </div>
    );
};

export default SubscriptionSuccess;
