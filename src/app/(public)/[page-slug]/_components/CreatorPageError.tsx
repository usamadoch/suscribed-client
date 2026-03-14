import { ApiClientError } from "@/lib/api";

interface CreatorPageErrorProps {
    code: 'NOT_PUBLISHED' | 'NOT_FOUND' | string;
}

const CreatorPageError = ({ code }: CreatorPageErrorProps) => {
    return (
        <div className="flex items-center justify-center h-screen bg-n-1 text-white">
            <div className="text-center">
                <h1 className="text-h3 mb-2">
                    {code === 'NOT_PUBLISHED' ? 'Page Not Published Yet' : 'Page Not Found'}
                </h1>
                <p className="text-n-3">
                    {code === 'NOT_PUBLISHED'
                        ? "This creator page is currently in draft mode and hasn't been published yet."
                        : "The page you are looking for does not exist."}
                </p>
            </div>
        </div>
    );
};

export default CreatorPageError;
