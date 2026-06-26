





import CreatorHeader from "@/layout/CreatorHeader";
import { CreatorHeaderProvider } from "@/context/CreatorHeaderContext";
import DraftBanner from "@/layout/DraftBanner";
import PublicSidebarWrapper from "./PublicSidebarWrapper";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CreatorHeaderProvider>
            <PublicSidebarWrapper>
                <div className="min-h-screen flex flex-col bg-background text-base antialiased dark:bg-n-1 w-full">
                    <DraftBanner />
                    <CreatorHeader />

                    {/* <div className="flex-1 flex flex-col"> */}
                    {children}
                    {/* </div> */}
                </div>
            </PublicSidebarWrapper>
        </CreatorHeaderProvider>
    );
};

export default PublicLayout;