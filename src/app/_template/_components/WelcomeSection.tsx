import { AuthUser } from "@/lib/types";

interface WelcomeSectionProps {
    user: AuthUser;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-n-1 dark:text-white mb-2">
            Welcome, {user.displayName}!
        </h1>
        <p className="text-n-2 dark:text-n-8">
            Discover new creators and stay connected with your subscriptions
        </p>
    </div>
);

export default WelcomeSection;
