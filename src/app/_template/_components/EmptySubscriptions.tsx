import Link from "next/link";
import Icon from "@/components/Icon";

const EmptySubscriptions = () => (
    <div className="card p-5">
        <div className="text-center">
            <div className="flex flex-col items-center py-3">
                <Icon name="team" className="w-12 h-12 mx-auto mb-3 text-n-2/30 dark:text-n-8" />
                <p className="text-n-2 dark:text-n-8">You haven&apos;t joined any creators yet</p>
            </div>
            <Link href="/explore" className="btn-purple btn-medium inline-flex w-full items-center gap-2 mt-4">
                <Icon name="search" className="w-4 h-4" />
                <span>Explore Creators</span>
            </Link>
        </div>
    </div>
);

export default EmptySubscriptions;
