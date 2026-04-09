import Icon from "@/components/Icon";

import { ChangeEvent, FormEvent } from "react";

type SearchProps = {
    className?: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    large?: boolean;
};

const Search = ({
    className,
    placeholder,
    value,
    onChange,
    onSubmit,
    large,
}: SearchProps) => {
    return (
        <form
            className={`relative ${className} ${large ? "w-full shadow-primary-4" : "w-[14.1rem]"
                }`}
            action=""
            onSubmit={onSubmit}
        >
            <input
                className={`w-full border border-n-1 bg-transparent text-n-1 outline-none placeholder:text-n-1 transition-colors focus:border-purple-1 dark:border-n-6 dark:text-n-8 dark:placeholder:text-n-8 dark:focus:border-purple-1 ${large
                    ? "h-16 pl-6 pr-18 bg-white text-base font-medium dark:bg-n-1"
                    : "h-8 pl-8 pr-4 text-xs font-bold"
                    }`}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
            <button
                className={`absolute text-0 ${large
                    ? "top-1/2 right-5 w-8 h-8 -translate-y-1/2 bg-purple-1 border border-n-1 transition-colors hover:bg-purple-1/90"
                    : "top-0 left-0 bottom-0 w-8"
                    }`}
            >
                <Icon className="text-n-1 dark:text-n-8" name="search" />
            </button>
        </form>
    );
};

export default Search;
