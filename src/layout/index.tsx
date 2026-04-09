





"use client"

import Menu from "./Menu";
import Sidebar from "./Sidebar";
import RightAuthSidebar from "./RightAuthSidebar";
import { RequireAuth, useAuth } from "@/store/auth";

type LayoutProps = {
    children: React.ReactNode;
    requireAuth?: boolean;
};

const Layout = ({
    children,
    requireAuth = true,
}: LayoutProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    // determine if right auth sidebar should be shown
    const showRightAuthSidebar = !requireAuth && !isLoading && !isAuthenticated;

    const content = (
        <div className={`relative flex pl-75 xl:pl-20 md:pl-0 md:pb-20 bg-n-1 ${showRightAuthSidebar ? 'pr-16 xl:pr-0' : ''}`}>
            <Sidebar />
            <div className="flex flex-col grow w-full min-h-screen md:pt-0 md:min-h-[calc(100vh-5rem)]">
                <div className="flex grow">
                    <div className="flex flex-col grow max-w-360 mx-auto pt-6 px-16 pb-2 2xl:px-8 lg:px-6 md:px-5 4xl:max-w-full">
                        {children}
                    </div>
                </div>
            </div>
            {showRightAuthSidebar && <RightAuthSidebar />}
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
