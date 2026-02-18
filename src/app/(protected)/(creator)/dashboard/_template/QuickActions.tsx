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
        <div className="flex flex-wrap gap-3 mb-6">
            <Link
                href={`/${pageSlug}`}
                target="_blank"
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="eye" className="w-4 h-4" />
                <span>View Public Profile</span>
            </Link>
            <Link
                href="/settings/profile"
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="edit" className="w-4 h-4" />
                <span>Edit Page</span>
            </Link>
            <button
                onClick={handleCopyLink}
                className="btn-stroke-light inline-flex items-center gap-2"
            >
                <Icon name="external-link" className="w-4 h-4" />
                <span>Copy Page Link</span>
            </button>
        </div>
    );
};

export default QuickActions;
