





import CreatorHeader from "@/layout/CreatorHeader";
import { CreatorHeaderProvider } from "@/context/CreatorHeaderContext";
import DraftBanner from "@/layout/DraftBanner";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CreatorHeaderProvider>
            <div className=" bg-background text-base antialiased dark:bg-n-2">
                <DraftBanner />
                <CreatorHeader />

                {/* <div className="flex-1 flex flex-col"> */}
                {children}
                {/* </div> */}
            </div>
        </CreatorHeaderProvider>
    );
};

export default PublicLayout;