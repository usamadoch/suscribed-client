"use client";
import React, { Suspense, useEffect } from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import { AuthTransitionProvider, useAuthTransition } from "./_context/AuthTransitionContext";

function AuthContent({ children }: { children: React.ReactNode }) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === "dark";
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {
        isTransitioning,
        hasTransitioned,
        isReversing,
        resetTransition,
        startReverseTransition
    } = useAuthTransition();

    const isLoginPage = pathname === "/login";
    const fromRegister = searchParams.get("from") === "register";

    // Reset transition state when navigating back to /register (browser back button)
    useEffect(() => {
        if (pathname === "/register" && (isTransitioning || hasTransitioned) && !isReversing) {
            startReverseTransition();
        }
    }, [pathname, isTransitioning, hasTransitioned, isReversing, startReverseTransition]);

    // Should the form be centered? Yes on login, or during/after a morph transition
    const shouldCenter = isLoginPage || isTransitioning || hasTransitioned;

    // Should background be hidden? Yes on login, or during/after a morph transition
    const shouldHideBackground = isLoginPage || isTransitioning || hasTransitioned;

    return (
        <div className="relative overflow-hidden">
            <div className="relative z-3 flex flex-col max-w-300 min-h-screen mx-auto px-7.5 py-12 xls:px-20 lg:px-8 md:px-6 md:py-8">
                <motion.div
                    className="flex flex-col grow w-full max-w-[27.31rem] lg:max-w-100"
                    initial={false}
                    animate={{
                        marginLeft: shouldCenter ? "auto" : "0",
                        marginRight: shouldCenter ? "auto" : undefined,
                    }}
                    transition={{
                        duration: 2.8,
                        ease: [0.22, 1, 0.36, 1], // easeOutQuint
                    }}
                >
                    <Logo className="w-25" disabled />
                    <div className="flex flex-col justify-center grow">
                        {children}
                    </div>
                </motion.div>
            </div>

            {/* Background graphics — animated fade/blur out */}
            <motion.div
                className="absolute -z-1 inset-0 overflow-hidden pointer-events-none"
                initial={false}
                animate={{
                    opacity: shouldHideBackground ? 0 : 1,
                    filter: shouldHideBackground ? "blur(8px)" : "blur(0px)",
                }}
                transition={{
                    duration: 2.4,
                    ease: "easeInOut",
                }}
            >
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
            </motion.div>
            <motion.div
                className="absolute top-1/2 right-[calc(50%-61.8125rem)] w-247.25 -translate-y-1/2 xls:right-[calc(50%-61rem)] xls:w-220 lg:right-[calc(50%-64rem)] md:hidden"
                initial={false}
                animate={{
                    opacity: shouldHideBackground ? 0 : 1,
                    filter: shouldHideBackground ? "blur(8px)" : "blur(0px)",
                }}
                transition={{
                    duration: 2.4,
                    ease: "easeInOut",
                }}
            >
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
            </motion.div>
        </div>
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthTransitionProvider>
            <Suspense>
                <AuthContent>{children}</AuthContent>
            </Suspense>
        </AuthTransitionProvider>
    );
}
