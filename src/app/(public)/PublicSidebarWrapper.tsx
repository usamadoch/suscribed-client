"use client";

import { useAuth } from "@/store/auth";
import Sidebar from "@/layout/Sidebar";
import { ReactNode } from "react";

export default function PublicSidebarWrapper({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <div className={`relative flex w-full flex-col grow ${(isAuthenticated && !isLoading) ? "pl-16 md:pl-0" : ""}`}>
            {(isAuthenticated && !isLoading) && <Sidebar isMinimize />}
            <div className="flex flex-col grow w-full min-w-0">
                {children}
            </div>
        </div>
    );
}
