import DraftBanner from "@/layout/DraftBanner";


const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <DraftBanner />
            {children}
        </>
    );
};

export default PageLayout;