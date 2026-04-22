"use client";
import React from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === "dark";
    const pathname = usePathname();
    const isLogin = pathname === "/login";

    return (
        <div className="relative overflow-hidden dark:bg-n-1">
            <div className="relative z-3 flex flex-col max-w-300 min-h-screen mx-auto p-12 mobile:px-8">
                <motion.div
                    layout
                    transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }}
                    className={`flex flex-col max-w-[27.31rem] tablet:max-w-100 w-full ${isLogin ? "mx-auto" : "tablet:mx-auto"}`}
                >
                    <motion.div layout transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }} className={`flex ${isLogin ? "justify-center" : "tablet:justify-center"}`}>
                        <Logo className="w-25 " disabled />
                    </motion.div>
                    <motion.div layout transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }} className="flex flex-col justify-center tablet:items-center grow w-full pt-24 mobile:pt-18">
                        <div className="w-full tablet:text-center">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            <AnimatePresence>
                {!isLogin && (
                    <motion.div
                        key="auth-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
                        transition={{ duration: 0.3 }}
                        className="tablet:hidden"
                    >
                        <div className="absolute -z-1 inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute z-1 inset-0 bg-n-2 opacity-0 dark:opacity-80"></div>
                            <div className="absolute top-[50%] left-[45vw] -translate-y-1/2 w-340 xl:w-240 tablet:left-[50vw] mobile:-top-[25%] mobile:-left-[30%] mobile:translate-y-0 mobile:w-120">
                                <Image
                                    className=""
                                    src="/images/bg.svg"
                                    width={1349}
                                    height={1216}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="absolute top-1/2 right-[calc(50%-61.8125rem)] w-247.25 -translate-y-1/2 xls:right-[calc(50%-61rem)] xls:w-220 tablet:right-[calc(50%-64rem)] mobile:hidden">
                            {/* Side content mockup hidden */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
