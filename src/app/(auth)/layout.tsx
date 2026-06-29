"use client";
import React from "react";
import Logo from "@/components/Logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative overflow-hidden dark:bg-n-1">
            <div className="relative z-3 flex flex-col max-w-300 min-h-screen mx-auto p-12 mobile:px-8">
                <div className="flex flex-col max-w-[27.31rem] tablet:max-w-100 w-full mx-auto">
                    <div className="flex justify-center">
                        <Logo className="w-25" disabled />
                    </div>
                    <div className="flex flex-col justify-center tablet:items-center grow w-full pt-24 mobile:pt-18">
                        <div className="w-full tablet:text-center">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
