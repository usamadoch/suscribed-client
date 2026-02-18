





import CreatorHeader from "@/layout/CreatorHeader";
import { CreatorHeaderProvider } from "@/context/CreatorHeaderContext";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CreatorHeaderProvider>
            <div className="flex flex-col min-h-screen">
                <CreatorHeader />
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </CreatorHeaderProvider>
    );
};

export default PublicLayout;