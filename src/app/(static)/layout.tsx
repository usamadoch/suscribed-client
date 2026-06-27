import DraftBanner from "@/layout/DraftBanner";
import StaticHeader from "@/layout/StaticHeader";
import PublicSidebarWrapper from "@/app/(public)/PublicSidebarWrapper";

const StaticLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PublicSidebarWrapper>
            <div className="min-h-screen flex flex-col bg-background text-base antialiased dark:bg-n-1 w-full">
                <DraftBanner />
                <StaticHeader />
                {children}
            </div>
        </PublicSidebarWrapper>
    );
};

export default StaticLayout;
