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
        <div className="relative overflow-hidden">
            <div className="relative z-3 flex flex-col max-w-300  min-h-screen mx-auto px-7.5 py-12 xls:px-20 lg:px-8 md:px-6 md:py-8">
                <motion.div
                    layout
                    transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }}
                    className={`flex flex-col grow max-w-[27.31rem] lg:max-w-100 w-full ${isLogin ? "mx-auto" : ""}`}
                >
                    <motion.div layout transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }} className={`flex ${isLogin ? "justify-center" : ""}`}>
                        <Logo className="w-25" disabled />
                    </motion.div>
                    <motion.div layout transition={{ duration: 0.4, ease: "easeInOut", delay: isLogin ? 0.15 : 0 }} className="flex flex-col justify-center grow w-full">
                        {children}
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
                    >
                        <div className="absolute -z-1 inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute z-1 inset-0 bg-n-2 opacity-0 dark:opacity-80"></div>
                            <div className="absolute top-[50%] left-[45vw] -translate-y-1/2 w-340 xl:w-240 lg:left-[50vw] md:-top-[25%] md:-left-[30%] md:translate-y-0 md:w-120">
                                <Image
                                    className=""
                                    src="/images/bg.svg"
                                    width={1349}
                                    height={1216}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="absolute top-1/2 right-[calc(50%-61.8125rem)] w-247.25 -translate-y-1/2 xls:right-[calc(50%-61rem)] xls:w-220 lg:right-[calc(50%-64rem)] md:hidden">
                            {/* <Image
                                className="w-full"
                                src={
                                    isDarkMode
                                        ? "/images/mockup-dark.png"
                                        : "/images/mockup-light.png"
                                }
                                width={989}
                                height={862}
                                alt=""
                            /> */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
