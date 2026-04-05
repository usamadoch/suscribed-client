import { toast } from "react-hot-toast";

type ShareOptions = {
    url?: string;
    title?: string;
    onCopySuccess?: () => void;
};

export const getShareUrl = (path?: string) => {
    if (!path) return typeof window !== 'undefined' ? window.location.href : '';
    if (path.startsWith('http')) return path;
    return typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
};

export const getSocialShareItems = (options: ShareOptions) => {
    const fullUrl = getShareUrl(options.url);

    return [
        {
            icon: "copy",
            label: "Copy link",
            viewBox: "0 0 24 24",
            onClick: () => {
                navigator.clipboard.writeText(fullUrl);
                if (options.onCopySuccess) {
                    options.onCopySuccess();
                } else {
                    toast.success("Link copied to clipboard");
                }
            },
        },
        {
            icon: "facebook",
            label: "Share on Facebook",
            onClick: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
            },
        },
        {
            icon: "twitter",
            label: "Share on Twitter",
            onClick: () => {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(options.title || '')}`, '_blank');
            },
        },
    ];
};
