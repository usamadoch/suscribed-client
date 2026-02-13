type TabType = {
    title: string;
    value: string;
    onClick?: () => void;
};

type TabsProps = {
    className?: string;
    classButton?: string;
    items: TabType[];
    value: string;
    setValue: (value: string) => void;
};

const Tabs = ({
    className,
    classButton,
    items,
    value,
    setValue,
}: TabsProps) => {
    const handleClick = (value: string, onClick?: () => void) => {
        setValue(value);
        if (onClick) onClick();
    };

    return (
        <div className={`flex flex-wrap -ml-1 ${className}`}>
            {items.map((item, index) => (
                <button
                    className={`h-8 ml-1 px-5 whitespace-nowrap text-xs font-bold transition-colors outline-none tap-highlight-color hover:text-n-3 dark:hover:text-purple-1 ${value === item.value
                        ? "bg-n-1 !text-white dark:bg-white/[0.08]"
                        : ""
                        } ${classButton}`}
                    onClick={() => handleClick(item.value, item.onClick)}
                    key={index}
                >
                    {item.title}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
