import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

type CommentProps = {
    className?: string;
    avatar?: string | null;
    placeholder: string;
    value: string;
    setValue: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSend?: () => void;
    disabled?: boolean;
    inputDisabled?: boolean; // New prop for disabling the input specifically
    button?: React.ReactNode;
    progress?: number;
    progressColor?: string;
    maxLength?: number;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
    overlayNode?: React.ReactNode;
};

const Comment = ({
    className,
    avatar,
    placeholder,
    value,
    setValue,
    onSend,
    disabled,
    inputDisabled,
    button,
    progress,
    progressColor,
    maxLength,
    inputRef,
    overlayNode,
}: CommentProps) => {
    return (
        <form
            className={`relative overflow-hidden flex pl-1 py-1 pr-5 bg-white border border-n-1 rounded-sm shadow-primary-4 md:pr-4 dark:bg-n-1 dark:border-n-6 ${className || ""}`}
            action=""
            onSubmit={(e) => {
                e.preventDefault();
                onSend?.();
            }}
        >
            {avatar && (
                <div className="flex items-center shrink-0 h-13.5">

                    <div className="relative  w-8 h-8 ml-4">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="profile"
                            src={avatar}
                            fill
                            alt="Avatar"
                        />
                    </div>
                </div>
            )}
            
            {overlayNode ? (
                <div className={`grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none md:px-3 dark:text-n-9 ${inputDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
                    {overlayNode}
                </div>
            ) : (
                <TextareaAutosize
                    ref={inputRef as any}
                    className={`grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none resize-none placeholder:text-n-1 md:px-3 dark:text-n-9 dark:placeholder:text-n-9 ${inputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    maxRows={5}
                    autoFocus
                    value={value}
                    onChange={setValue}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (value && value.trim() && !disabled && !inputDisabled) {
                                onSend?.();
                            }
                        }
                    }}
                    placeholder={placeholder}
                    required
                    disabled={inputDisabled}
                    maxLength={maxLength}
                />
            )}
            <div className="flex items-center shrink-0 h-13.5 gap-2">
                {/* <button
                    className="btn-transparent-dark btn-square btn-small mr-1 md:hidden"
                    type="button"
                >
                    <Icon name="smile" />
                </button>
                <button
                    className="btn-transparent-dark btn-square btn-small mr-3 md:hidden"
                    type="button"
                >
                    <Icon name="plus" />
                </button> */}
                {button !== undefined ? button : (
                    <button
                        className={`btn-purple btn-square btn-small ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        type="submit"
                        disabled={disabled}
                    >
                        <Icon name="send" />
                    </button>
                )}
            </div>
            {progress !== undefined && (
                <div
                    className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${progressColor || 'bg-purple-1'}`}
                    style={{ width: `${progress}%` }}
                />
            )}
        </form>
    );
};

export default Comment;
