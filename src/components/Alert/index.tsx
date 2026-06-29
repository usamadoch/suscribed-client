import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/icon";
import { CheckCircle, X, AlertCircle, Info, OctagonX } from "@/lib/icons";

export type AlertType = "success" | "error" | "warning" | "info";

type AlertProps = {
    type?: AlertType;
    message?: string;
    children?: React.ReactNode;
    className?: string;
    showIcon?: boolean;
    onClose?: () => void;
};

const Alert = ({
    type = "info",
    message,
    children,
    className,
    showIcon = true,
    onClose,
}: AlertProps) => {
    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-600",
        info: "bg-purple-500",
    };

    const icons = {
        success: CheckCircle,
        error: OctagonX,
        warning: AlertCircle,
        info: Info,
    };

    return (
        <div
            className={twMerge(
                "relative flex items-center h-10 px-4 rounded-full transition-all text-n-9 shadow-md",
                styles[type],
                className
            )}
        >
            {showIcon && (
                <Icon icon={icons[type]} strokeWidth={2.5} size={16} className="mr-2 shrink-0" />
            )}
            <div className="flex-1 text-sm font-bold">
                {message || children}
            </div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className=" ml-3 cursor-pointer shrink-0"
                    aria-label="Close alert"
                >
                    <Icon icon={X} size={20} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
};

export default Alert;
