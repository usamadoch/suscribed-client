
import Image from "@/components/Image";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { getFullImageUrl } from "@/lib/utils";
import { CreatorPage } from "@/lib/types";

type JoinMembershipModalProps = {
    visible: boolean;
    onClose: () => void;
    page: CreatorPage;
    onJoin: () => void;
    isJoining: boolean;
};

const JoinMembershipModal = ({
    visible,
    onClose,
    page,
    onJoin,
    isJoining
}: JoinMembershipModalProps) => {

    return (
        <Modal
            classWrap="relative border-b-none max-w-sm"
            classButtonClose="z-2 fill-white"
            visible={visible}
            onClose={onClose}
        >
            <div className="relative z-1 card-title text-white">
                Unlock this post
            </div>
            <div className="px-5 pb-7 md:pt-8">
                <div className="mb-6 text-center">
                    <div className="relative w-full mt-5 aspect-[3/1] overflow-hidden bg-n-2 dark:bg-n-7 rounded-t-xl">
                        <Image
                            className="object-cover"
                            src={getFullImageUrl(page.bannerUrl) || "/images/bg-1.jpg"}
                            fill
                            alt="Banner"
                            unoptimized
                        />
                    </div>

                    <div className="relative z-1 -mt-10 w-20 h-20 mx-auto mb-3 border-4 border-white rounded-full dark:border-n-1 bg-n-1">
                        <Image
                            className="object-cover rounded-full"
                            src={getFullImageUrl(page.avatarUrl) || "/images/avatars/avatar.jpg"}
                            fill
                            alt="Creator Avatar"
                            unoptimized
                        />
                    </div>

                    <div className="text-sm font-medium text-n-1 dark:text-white mt-4 mx-4">
                        View this and other exclusive posts from {page.displayName}
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        className="btn-purple btn-medium w-full"
                        onClick={onJoin}
                        disabled={isJoining}
                    >
                        {isJoining ? <Loader /> : <span>Become a member</span>}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default JoinMembershipModal;
