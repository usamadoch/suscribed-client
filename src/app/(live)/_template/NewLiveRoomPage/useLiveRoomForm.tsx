import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import { liveApi, CreateLiveSessionPayload } from "@/services/live.service";

export const useLiveRoomForm = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [streamLink, setStreamLink] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
    const [youtubeChannelId, setYoutubeChannelId] = useState<string | null>(null);
    const [accessType, setAccessType] = useState<"public" | "members">("public");
    const [paidMessagesEnabled, setPaidMessagesEnabled] = useState(true);
    const [mergeYouTubeChat, setMergeYouTubeChat] = useState(false);
    const [notifyEmailOnLive, setNotifyEmailOnLive] = useState(true);
    const [notifyPushOnLive, setNotifyPushOnLive] = useState(true);

    const mutation = useMutation({
        mutationFn: (payload: CreateLiveSessionPayload) => liveApi.createSession(payload),
        onSuccess: (data) => {

            if (data?._id) {
                router.push(`/live-room/${data._id}/control`);
            }
        },
        onError: (error: any) => {
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="error"
                    message={error?.message || "Failed to start live session"}
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
        }
    });

    const handleConnect = (videoId: string, streamTitle?: string) => {
        setYoutubeVideoId(videoId);
        setIsConnected(true);
        if (streamTitle) {
            setTitle(streamTitle);
        }
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setStreamLink("");
        setYoutubeVideoId(null);
    };

    const handleSubmit = () => {
        if (!isConnected || !youtubeVideoId) {
            toast.custom((t) => (
                <Alert
                    className="mb-0"
                    type="error"
                    message="Please connect your stream first!"
                    onClose={() => toast.dismiss(t.id)}
                />
            ), { position: "bottom-right" });
            return;
        }

        mutation.mutate({
            title,
            youtubeVideoId,
            youtubeChannelId,
            accessType,
            paidMessagesEnabled,
            mergeYouTubeChat,
            notifyEmailOnLive,
            notifyPushOnLive,
        });
    };

    return {
        title, setTitle,
        streamLink, setStreamLink,
        isConnected, setIsConnected,
        youtubeVideoId, setYoutubeVideoId,
        youtubeChannelId, setYoutubeChannelId,
        accessType, setAccessType,
        paidMessagesEnabled, setPaidMessagesEnabled,
        mergeYouTubeChat, setMergeYouTubeChat,
        notifyEmailOnLive, setNotifyEmailOnLive,
        notifyPushOnLive, setNotifyPushOnLive,
        handleConnect,
        handleDisconnect,
        handleSubmit,
        isSubmitting: mutation.isPending
    };
};
