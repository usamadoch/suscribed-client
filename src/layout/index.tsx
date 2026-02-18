


"use client"

import Menu from "./Menu";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CreatorHeader from "./CreatorHeader";
import Footer from "./Footer";

import { RequireAuth } from "@/store/auth";
import { useHeaderConfig } from "@/context/HeaderContext";

type LayoutProps = {
    children: React.ReactNode;
    requireAuth?: boolean;
};

const Layout = ({
    children,
    requireAuth = true,
}: LayoutProps) => {
    const { title, back, createBtn = true, onBack, headerVariant = "default" } = useHeaderConfig();

    const isPublic = headerVariant === "public";

    const content = (
        <div className={`relative ${!isPublic ? "pl-75 xl:pl-20 md:pl-0 md:pb-20" : ""}`}>
            {!isPublic && <Sidebar />}
            <div className={`flex flex-col min-h-screen ${!isPublic ? "pt-18 md:pt-0" : ""} md:min-h-[calc(100vh-5rem)]`}>
                {isPublic ? (
                    <CreatorHeader pageName={title} />
                ) : (
                    <Header back={back} title={title} createBtn={createBtn} onBack={onBack || undefined} />
                )}
                <div className="flex grow">
                    <div className={`flex flex-col grow max-w-360 mx-auto pt-6 px-16 pb-2 2xl:px-8 lg:px-6 md:px-5 ${isPublic ? "4xl:max-w-full mt-18" : "4xl:max-w-full"}`}>
                        {children}
                    </div>
                </div>
                {!isPublic && <Footer />}

            </div>
            {!isPublic && <Menu />}
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
