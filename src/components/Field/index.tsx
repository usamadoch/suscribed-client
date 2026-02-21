import { useState, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

type FieldProps = {
    className?: string;
    classInput?: string;
    label?: string;
    textarea?: boolean;
    type?: string;
    value?: string;
    onChange?: any;
    placeholder?: string;
    required?: boolean;
    icon?: string;
    image?: string;
    currency?: string;
    error?: any;
    prefix?: string;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldProps>(
    (
        {
            className,
            classInput,
            label,
            textarea,
            type,
            value,
            onChange,
            placeholder,
            required,
            icon,
            image,
            currency,
            error,
            prefix,
            ...props
        },
        ref
    ) => {
        const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

        return (
            <div className={`${className}`}>
                <div className="">
                    {label && <div className="mb-3 text-xs font-bold">{label}</div>}
                    <div
                        className={twMerge(
                            "relative",
                            prefix &&
                            "flex items-center w-full bg-white border border-n-1 transition-colors focus-within:border-purple-1 dark:bg-n-1 dark:border-white dark:focus-within:border-purple-1",
                            prefix && error && "border-pink-1!",
                            prefix && classInput
                        )}
                    >
                        {prefix && (
                            <div className="pl-5 text-sm font-bold text-n-3 whitespace-nowrap pointer-events-none">
                                {prefix}
                            </div>
                        )}
                        {textarea ? (
                            <textarea
                                className={twMerge(
                                    `w-full h-24 px-5 py-3 bg-white border border-n-1 text-sm text-n-1 font-bold outline-none resize-none transition-colors placeholder:text-n-3 focus:border-purple-1 dark:bg-n-1 dark:border-white dark:text-white dark:focus:border-purple-1 dark:placeholder:text-white/75 ${icon ? "pr-15" : ""
                                    } ${error ? "pr-15 border-pink-1!" : ""} ${image || currency ? "pr-15" : ""
                                    } ${classInput}`
                                )}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                required={required}
                                ref={ref as any}
                                {...props}
                            ></textarea>
                        ) : (
                            <input
                                className={twMerge(
                                    `w-full h-16 bg-white border border-n-1 text-sm text-n-1 font-bold outline-none transition-colors placeholder:text-n-3 focus:border-purple-1 dark:bg-n-1 dark:border-white dark:text-white dark:focus:border-purple-1 dark:placeholder:text-white/75 ${icon || type === "password" ? "pr-15" : ""
                                    } ${error ? "pr-15 border-pink-1!" : ""} ${image || currency ? "pr-15" : ""
                                    } ${classInput}`,
                                    prefix ? "flex-1 h-full bg-transparent border-none pl-0" : "px-5"
                                )}
                                type={
                                    (type === "password" &&
                                        (visiblePassword ? "text" : "password")) ||
                                    type ||
                                    "text"
                                }
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                required={required}
                                ref={ref as any}
                                {...props}
                            />
                        )}
                        {icon && type !== "password" && !error && (
                            <Icon
                                className="absolute top-1/2 right-5 -translate-y-1/2 icon-20 fill-n-1 pointer-events-none dark:fill-white"
                                name={icon}
                            />
                        )}
                        {type === "password" && !error && (
                            <button
                                className="group absolute top-0 right-0 bottom-0 w-15 outline-none"
                                type="button"
                                onClick={() => setVisiblePassword(!visiblePassword)}
                            >
                                <Icon
                                    className="icon-20 fill-n-2 transition-colors group-hover:fill-n-1 dark:fill-white/75 dark:group-hover:fill-white"
                                    name={visiblePassword ? "eye" : "eye-slash"}
                                />
                            </button>
                        )}
                        {error && (
                            <Icon
                                className="absolute top-1/2 right-5 -translate-y-1/2 icon-20 fill-pink-1 pointer-events-none"
                                name="info-circle"
                            />
                        )}
                        {image && (
                            <div className="absolute top-1/2 right-5 w-5 p-0.25 -translate-y-1/2 text-0 dark:bg-white">
                                <Image
                                    className="w-full"
                                    src={image}
                                    width={20}
                                    height={20}
                                    alt=""
                                />
                            </div>
                        )}
                        {currency && (
                            <div className="absolute top-1/2 right-5 -translate-y-1/2 text-sm font-medium">
                                {currency}
                            </div>
                        )}
                    </div>
                    {error && <div className="mt-2 text-xs text-pink-1">{error.message}</div>}
                </div>
            </div>
        );
    }
);

Field.displayName = "Field";

export default Field;
