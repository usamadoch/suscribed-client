





"use client"

import Menu from "./Menu";
import Sidebar from "./Sidebar";
import { RequireAuth } from "@/store/auth";

type LayoutProps = {
    children: React.ReactNode;
    requireAuth?: boolean;
};

const Layout = ({
    children,
    requireAuth = true,
}: LayoutProps) => {

    const content = (
        <div className="relative pl-75 xl:pl-20 md:pl-0 md:pb-20">
            <Sidebar />
            <div className="flex flex-col min-h-screen md:pt-0 md:min-h-[calc(100vh-5rem)]">
                <div className="flex grow">
                    <div className="flex flex-col grow max-w-360 mx-auto pt-6 px-16 pb-2 2xl:px-8 lg:px-6 md:px-5 4xl:max-w-full">
                        {children}
                    </div>
                </div>
            </div>
            <Menu />
        </div>
    );

    if (requireAuth) {
        return (
            <RequireAuth>
                {content}
            </RequireAuth>
        );
    }

    return content;
};

export default Layout;
