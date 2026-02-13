import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";

type CategoriesProps = {
    label?: string;
    items: string[];
    options: any[];
    onChange: (item: any) => void;
    onRemove: (index: number) => void;
    className?: string;
};

const Categories = ({
    label,
    items,
    options,
    onChange,
    onRemove,
    className,
}: CategoriesProps) => {
    return (
        <div className={className}>
            {label && <div className="mb-3 text-xs font-bold">{label}</div>}
            <Listbox value={null} onChange={onChange}>
                {({ open }) => (
                    <div className="relative">
                        <ListboxButton
                            as="div"
                            className={twMerge(
                                `relative w-full h-12 px-5 py-3 text-left bg-white border border-n-1 text-sm text-n-1 font-bold outline-none transition-colors cursor-pointer dark:bg-n-1 dark:border-white dark:text-white ${open ? "border-purple-1 dark:border-purple-1" : ""
                                }`
                            )}
                        >
                            <div className="flex flex-wrap -mt-1.5 -mx-0.75 pr-8">
                                {items.length > 0 ? (
                                    items.map((specification, index) => (
                                        <div
                                            className="inline-flex items-center label-stroke mt-1.5 mx-0.75 text-xs font-bold"
                                            key={index}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="group mr-1"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemove(index);
                                                }}
                                            >
                                                <Icon
                                                    className="transition-colors dark:fill-white group-hover:fill-pink-1"
                                                    name="close"
                                                />
                                            </button>
                                            {specification}
                                        </div>
                                    ))
                                ) : (
                                    <span className="mt-1.5 mx-0.75 text-n-3 dark:text-white/75">
                                        {/* Select options... */}
                                    </span>
                                )}
                            </div>
                            <Icon
                                className={`absolute top-3.5 right-4 icon-20 transition-transform dark:fill-white ${open ? "rotate-180" : ""
                                    }`}
                                name="arrow-bottom"
                            />
                        </ListboxButton>
                        <Transition
                            leave="transition duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions className="absolute left-0 right-0 z-10 mt-1 p-2 bg-white border border-n-3 shadow-lg dark:bg-n-1 dark:border-white">
                                {options.map((item) => (
                                    <ListboxOption
                                        className="flex items-start px-3 py-2 text-sm font-bold text-n-3 transition-colors cursor-pointer hover:text-n-1 ui-selected:!bg-n-3/20 ui-selected:!text-n-1 tap-highlight-color dark:text-white/50 dark:hover:text-white dark:ui-selected:!text-white"
                                        key={item.id}
                                        value={item}
                                    >
                                        {item.title}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                )}
            </Listbox>
        </div>
    );
};

export default Categories;
