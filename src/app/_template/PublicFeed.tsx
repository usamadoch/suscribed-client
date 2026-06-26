










"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, Heart, Zap } from "lucide-react";

// ======================
// PUBLIC FEED
// ======================
const PublicFeed = () => {
    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden min-h-[60vh]">
            {/* Background animated SVGs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-20 max-w-5xl mx-auto">
                <motion.div
                    animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[15%] text-purple-1"
                >
                    <Sparkles size={48} strokeWidth={1.5} />
                </motion.div>
                <motion.div
                    animate={{ y: [20, -20, 20], rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[15%] text-[#daf464]"
                >
                    <Compass size={64} strokeWidth={1.5} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[25%] text-[#ff5a5f]"
                >
                    <Heart size={32} strokeWidth={1.5} />
                </motion.div>
                <motion.div
                    animate={{ x: [-15, 15, -15], y: [-15, 15, -15] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[25%] text-purple-1"
                >
                    <Zap size={40} strokeWidth={1.5} />
                </motion.div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center text-center max-w-2xl"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-1/10 text-purple-1 mb-6">
                    <Compass size={32} />
                </div>

                <h2 className="text-h2 text-n-1 dark:text-n-9 mb-6 font-bold">
                    Discover Your Next <span className="text-purple-1">Obsession</span>
                </h2>

                <p className="text-n-3 text-h6 font-medium dark:text-n-8 mb-10">
                    Access exclusive posts, join private communities, and connect directly with top creators. Sign in to view your personalized feed.
                </p>
            </motion.div>
        </div>
    );
};

export default PublicFeed;