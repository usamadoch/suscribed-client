import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/Image";
import Icon from "@/components/Icon";

type ImagesProps = {
    items: string[];
    imageBig?: boolean;
};

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
    }),
};

const Images = ({ items, imageBig }: ImagesProps) => {
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        let newPage = page + newDirection;
        if (newPage < 0 || newPage >= items.length) return;
        setPage([newPage, newDirection]);
    };

    if (!items || items.length === 0) return null;

    const currentIndex = page;

    return (
        <div className={`relative pb-2.5 group w-full pr-5 ${imageBig ? "h-80" : "h-120"}`}>
            <div className="w-full h-full relative border border-n-4 dark:border-white overflow-hidden bg-n-8">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { ease: [0.45, 0, 0.55, 1], duration: 0.4 },
                            opacity: { duration: 0.15 },
                        }}
                        className="absolute inset-0 w-full h-full will-change-transform"
                    >
                        <Image
                            className="object-contain"
                            family="post" // Use post family
                            slot="feed"   // Use feed slot (600x600) for review images
                            src={items[currentIndex]}
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw"
                            alt=""
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {items.length > 1 && (
                <>
                    {/* Image Count */}
                    <div className="absolute top-4 right-8 bg-n-1/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white pointer-events-none z-10">
                        {currentIndex + 1} / {items.length}
                    </div>

                    {/* Left Arrow */}
                    {currentIndex !== 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(-1); // Previous
                            }}
                            className="absolute top-[50%] -translate-y-[50%] left-4 w-8 h-8 rounded-full bg-n-1/50 hover:bg-n-1/75 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 duration-300 z-20"
                        >
                            <Icon name="arrow-prev" className="w-4 h-4 fill-white" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {currentIndex !== items.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(1); // Next
                            }}
                            className="absolute top-[50%] -translate-y-[50%] right-8 w-8 h-8 rounded-full bg-n-1/50 hover:bg-n-1/75 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 duration-300 z-20"
                        >
                            <Icon name="arrow-next" className="w-4 h-4 fill-white" />
                        </button>
                    )}

                    {/* Dots */}
                    <div className="absolute bottom-4 w-full flex justify-center py-2 space-x-2 z-20">
                        {items.map((_, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const dir = slideIndex > currentIndex ? 1 : -1;
                                    setPage([slideIndex, dir]);
                                }}
                                className={`h-2 w-2 rounded-full cursor-pointer shadow-sm transition-all ${currentIndex === slideIndex
                                    ? "bg-white scale-125"
                                    : "bg-white/60 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Images;
