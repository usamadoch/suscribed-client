import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Field from "@/components/Field";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";
import { fetchApi } from "@/services/api.client";

interface FormValues {
    streamLink: string;
}

interface StreamPlayerProps {
    streamLink: string;
    setStreamLink: (link: string) => void;
    isConnected: boolean;
    onConnect: (videoId: string, title?: string) => void;
    onDisconnect: () => void;
}

const StreamPlayer = ({ streamLink, setStreamLink, isConnected, onConnect, onDisconnect }: StreamPlayerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: { streamLink: streamLink || "" }
    });

    const currentLink = watch("streamLink");

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const res = await fetchApi<{ videoId: string; isLive: boolean; title: string; activeLiveChatId: string | null }>(
                `/live/youtube/validate-url?url=${encodeURIComponent(data.streamLink)}`
            );

            if (res.videoId && res.isLive) {
                setStreamLink(data.streamLink);
                onConnect(res.videoId, res.title);

            } else if (res.videoId && !res.isLive) {
                toast.custom((t) => (
                    <Alert
                        className="mb-0"
                        type="warning"
                        message="This stream isn't live right now. Make sure your YouTube stream is active, then try connecting again."
                        onClose={() => toast.dismiss(t.id)}
                    />
                ), { position: "bottom-right" });
            } else {
                toast.custom((t) => (
                    <Alert
                        className="mb-0"
                        type="error"
                        message="We couldn't verify this YouTube stream. Please make sure the URL is correct."
                        onClose={() => toast.dismiss(t.id)}
                    />
                ), { position: "bottom-right" });
            }
        } catch (error: any) {
            console.error(error);
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="error"
                    message={error?.message || "Verification failed. Check your link and ensure the stream is active on YouTube."}
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        } finally {
            setIsLoading(false);
        }
    };

    // YouTube ID extractor
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (isConnected) {
        const videoId = getYoutubeId(streamLink);

        return (
            <div className="w-full aspect-video bg-black rounded-xl border border-n-4 dark:border-n-6 overflow-hidden flex flex-col items-center justify-center relative group shadow-primary-4">
                {videoId && (
                    <iframe
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full aspect-video bg-white dark:bg-n-1 border border-n-4 dark:border-n-6 shadow-primary-4 rounded-xl flex flex-col items-center justify-center p-8 text-center relative">
            <div className="text-5xl mb-4 select-none animate-bounce duration-1000">📺</div>
            <h2 className="text-h4 font-bold mb-2 dark:text-n-9">Add your stream link</h2>
            <p className="text-xs text-n-3 dark:text-n-8 max-w-md mb-6 leading-relaxed">
                Paste your YouTube live stream URL below to connect.
                We will embed the stream player so your audience can watch and interact directly on this page.
            </p>

            <div className="w-full max-w-md flex gap-2 items-stretch">
                <Field
                    {...register("streamLink", { required: "Stream link is required" })}
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    className="grow"
                    classInput="h-10 text-xs rounded-xs"
                    error={errors.streamLink}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !currentLink?.trim()}
                    className="btn-purple btn-medium h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader className="text-n-1 dark:text-white h-4 w-4" /> : "Connect"}
                </button>
            </div>
        </form>
    );
};

export default StreamPlayer;
