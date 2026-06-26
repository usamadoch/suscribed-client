import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ExternalLink, Settings, Copy } from "@/lib/icons";

interface QuickActionsProps {
    pageSlug: string;
}

const QuickActions = ({ pageSlug }: QuickActionsProps) => {
    const handleCopyLink = () => {
        const url = `${window.location.origin}/${pageSlug}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="mb-6">

            <div className="flex mt-8 md:mt-6">
                <Link
                    href={`/${pageSlug}`}
                    target="_blank"
                    className="btn-stroke btn-medium grow gap-2"
                >
                    <Icon icon={ExternalLink} />
                    <span>View Public Profile</span>
                </Link>
                <Link
                    href="/settings"
                    className="btn-stroke btn-medium btn-square cursor-pointer shrink-0 ml-1.5 flex items-center justify-center"
                >
                    <Icon icon={Settings} />
                </Link>
                <button
                    onClick={handleCopyLink}
                    className="btn-stroke btn-medium btn-square cursor-pointer shrink-0 ml-1.5 flex items-center justify-center"
                >
                    <Icon icon={Copy} />
                </button>
            </div>


        </div>
    );
};

export default QuickActions;
