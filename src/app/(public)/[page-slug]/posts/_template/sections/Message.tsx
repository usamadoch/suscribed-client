import Image from "@/components/Image";

/**
 * Props for the Message component.
 *
 * Type guide rules applied:
 * - `content` was optional → required (a message always has content in the domain)
 * - `images` stays optional (messages may or may not have image attachments)
 * - Removed unused imports: `useState`, `Checkbox`, `Icon`
 */
type MessageProps = {
    user: string;
    email: string;
    avatar: string;
    date: string;
    time: string;
    content: string;
    /** Optional: only present when the message includes image attachments */
    images?: string[];
};

const Message = ({
    user,
    email,
    avatar,
    date,
    time,
    content,
    images,
}: MessageProps) => {
    return (
        <div className="text-sm">
            <div className="flex items-start md:flex-wrap">
                <div className="flex items-center">
                    <div className="relative shrink-0 w-8 h-8 mr-3">
                        <Image
                            className="object-cover rounded-full"
                            src={avatar}
                            fill
                            alt="Avatar"
                        />
                    </div>
                    <div>
                        <div className="font-bold">{user}</div>
                        <div className="text-n-3 dark:text-white/50">
                            {email} to <span className="text-n-1">me</span>
                        </div>
                    </div>
                </div>
                <div className="ml-auto pt-0.75 text-xs font-medium md:w-full md:ml-11">
                    {date}{" "}
                    <span className="relative -top-0.5 inline-block w-0.5 h-0.5 mx-2.5 bg-n-1 dark:bg-white"></span>
                    {time}
                </div>
            </div>
            <div className="mt-3">{content}</div>
            {images && (
                <div className="flex flex-wrap mt-1 -ml-2 md:-mx-1">
                    {images.map((image, index) => (
                        <div
                            className="relative w-41.5 h-31 mt-2 ml-2 border border-n-1 md:w-[calc(50%-0.5rem)] md:mx-1"
                            key={index}
                        >
                            <Image
                                className="object-cover rounded-sm"
                                src={image}
                                fill
                                alt=""
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Message;
