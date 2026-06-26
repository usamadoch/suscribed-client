
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import { Icon } from "@/components/ui/icon";
import { Copy } from "@/lib/icons";
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
                        {/* <Image
                            className="object-cover"
                            family="banner"
                            slot="creatorPage"
                            src={bannerUrl}
                            fill
                            alt="Banner"
                        /> */}
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
                        icon: <Icon icon={Copy} className="-mt-0.25 mr-3 w-5 h-5 text-n-1 dark:text-n-9" />,
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
                        icon: (
                            <svg className="-mt-0.25 mr-3 w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        ),
                        text: "Share on Facebook",
                        onClick: () => {
                            const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`;
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
                        }
                    },
                    {
                        icon: (
                            <svg className="-mt-0.25 mr-3 w-5 h-5 fill-[#1DA1F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        ),
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
                        {item.icon}
                        {item.text}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ShareModal;
