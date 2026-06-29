import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Users, Search } from "@/lib/icons";

const EmptySubscriptions = () => (
    <div className="card flex flex-col items-center justify-center px-5 py-16 md:py-20 text-center">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-n-2/5 dark:bg-white/5">
            <Icon icon={Users} className="w-10 h-10 text-n-2/50 dark:text-n-8" />
        </div>
        <h3 className="text-h4 mb-3 text-n-1 dark:text-white">Your feed is empty</h3>
        <p className="text-n-3 dark:text-n-8 mb-8 max-w-[20rem] mx-auto text-base">
            You haven&apos;t joined any creators yet. Discover and subscribe to your favorite creators to see their content here.
        </p>
        <Link href="/explore" className="btn-purple inline-flex items-center justify-center gap-2 px-8">
            <Icon icon={Search} strokeWidth={2} />
            <span>Explore Creators</span>
        </Link>
    </div>
);

export default EmptySubscriptions;
