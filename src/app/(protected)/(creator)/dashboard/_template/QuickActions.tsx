import Link from "next/link";
import Icon from "@/components/Icon";

interface QuickActionsProps {
    pageSlug: string;
}

const QuickActions = ({ pageSlug }: QuickActionsProps) => {
    const handleCopyLink = () => {
        const url = `${window.location.origin}/${pageSlug}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className=" mb-6">


            <div className="flex mt-8 md:mt-6">
                <Link
                    href={`/${pageSlug}`}
                    target="_blank"
                    className="btn-stroke btn-medium grow gap-2"
                >
                    <Icon name="new-window" viewBox="0 0 24 24" className="w-4 h-4" />
                    <span>View Public Profile</span>
                </Link>
                <Link
                    href="/settings"
                    className="btn-stroke btn-medium btn-square shrink-0 ml-1.5 flex items-center justify-center"
                >
                    <Icon name="setup" className="w-5 h-5" />
                </Link>
                <button
                    onClick={handleCopyLink}
                    className="btn-stroke btn-medium btn-square shrink-0 ml-1.5 flex items-center justify-center"
                >
                    <Icon name="arrow-up-right" className="w-5 h-5" />
                </button>
            </div>


        </div>
    );
};

export default QuickActions;
