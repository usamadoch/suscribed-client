import { useState, createElement } from "react";
import { toast } from "react-hot-toast";
import Alert from "@/components/Alert";
import { useJoinPage } from "@/hooks/queries";
import { Post } from "@/types";
import { useAuth } from "@/store/auth";

export const usePostJoin = (post: Post | null | undefined) => {
    const { user } = useAuth();
    const { mutate: joinPage, isPending: isJoining } = useJoinPage();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleJoin = () => {
        if (!post) return;

        if (user) {
            const creatorId =
                typeof post.creatorId === "object"
                    ? post.creatorId._id
                    : post.creatorId;
            const pageId =
                typeof post.pageId === "object" ? post.pageId._id : post.pageId;

            joinPage(
                { creatorId, pageId },
                {
                    onSuccess: () => {
                        toast.custom((t) =>
                            createElement(Alert, {
                                type: "success",
                                message: "You've successfully joined!",
                                onClose: () => toast.dismiss(t.id),
                            })
                        );
                    }
                }
            );
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return {
        user,
        isJoining,
        handleJoin,
        isLoginModalOpen,
        setIsLoginModalOpen
    };
};
