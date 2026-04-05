
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Alert from "@/components/Alert";


type ShareModalProps = {
    visible: boolean;
    onClose: () => void;
    shareUrl: string;
    bannerUrl?: string | null;
    avatarUrl?: string | null;
    title?: string;
};

const ShareModal = ({
    visible,
    onClose,
    shareUrl,
    bannerUrl,
    avatarUrl,
    title
}: ShareModalProps) => {


    return (
        <Modal
            classButtonClose="z-2 fill-white"
            showCloseIcon={false}
            visible={visible}
            onClose={onClose}



        >
            {title && (
                <div className="relative z-1 card-title text-n-1 dark:text-white ">
                    {title}
                </div>
            )}
            <div className="pb-5 md:pt-8">
                <div className="p-5 text-center">
                    <div className=" border border-n-4 relative w-full aspect-3/1 overflow-hidden bg-n-2 dark:bg-n-7">
                        <Image
                            className="object-cover"
                            family="banner"
                            slot="creatorPage"
                            src={bannerUrl}
                            fill
                            alt="Banner"
                        />
                    </div>

                    <div className="relative z-1 -mt-10 w-20 h-20 ml-5 mb-3 border-4 border-white rounded-full dark:border-n-1 bg-n-1">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="profile"
                            src={avatarUrl}
                            fill
                            alt="Creator Avatar"
                        />
                    </div>
                </div>


                {[
                    {
                        icon: "copy",
                        viewBox: "0 0 24 24",
                        text: "Copy link",
                        onClick: () => {
                            const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`;
                            navigator.clipboard.writeText(fullUrl);
                            toast.custom((t) => (
                                <Alert
                                    className="mb-0 shadow-md"
                                    type="success"
                                    message="Link copied to clipboard"
                                    onClose={() => toast.dismiss(t.id)}
                                />
                            ), { position: "bottom-right" });

                        }
                    },
                    {
                        icon: "facebook",
                        text: "Share on Facebook",
                        onClick: () => {
                            const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`;
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
                        }
                    },
                    {
                        icon: "twitter",
                        text: "Share on Twitter",
                        onClick: () => {
                            const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`;
                            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`, '_blank');
                        }
                    }
                ].map((item, index) => (
                    <button
                        key={index}
                        className="flex items-center w-full h-10 mb-1.5 px-6.5 text-sm font-bold last:mb-0 transition-colors hover:bg-n-3/10 dark:hover:bg-white/20"
                        onClick={item.onClick}
                    >
                        <Icon
                            className="-mt-0.25 mr-3 fill-n-1 dark:fill-white"
                            name={item.icon}
                            viewBox={item.viewBox}
                        />
                        {item.text}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ShareModal;
