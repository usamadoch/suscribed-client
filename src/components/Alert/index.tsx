import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";

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
        success: "bg-green-1 text-n-1 border-n-1",
        error: "bg-pink-1 text-n-1 border-n-1",
        warning: "bg-yellow-1 text-n-1 border-n-1",
        info: "bg-purple-3 text-n-1 border-n-1",
    };

    const icons = {
        success: "check-circle",
        error: "close",
        warning: "info-circle",
        info: "info-circle",
    };

    return (
        <div
            className={twMerge(
                "relative flex items-center h-12 px-5 border mb-4 transition-all",
                styles[type],
                className
            )}
        >
            {showIcon && (
                <Icon name={icons[type]} className="mr-3 shrink-0 icon-20" />
            )}
            <div className="flex-1 text-sm font-bold">
                {message || children}
            </div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-3 cursor-pointer shrink-0 hover:opacity-70 transition-opacity"
                    aria-label="Close alert"
                >
                    <Icon name="close" className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;
