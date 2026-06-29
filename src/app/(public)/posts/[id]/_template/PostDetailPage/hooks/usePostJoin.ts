import { useState } from "react";
import { Post } from "@/types";
import { useAuth } from "@/store/auth";

export const usePostJoin = (post: Post | null | undefined) => {
    const { user } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isJoinTierModalOpen, setIsJoinTierModalOpen] = useState(false);

    const handleJoin = () => {
        if (!post) return;

        if (user) {
            setIsJoinTierModalOpen(true);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return {
        user,
        handleJoin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isJoinTierModalOpen,
        setIsJoinTierModalOpen
    };
};
