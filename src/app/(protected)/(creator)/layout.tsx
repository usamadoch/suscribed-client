import { RequireCreator } from "@/store/auth";



const CreatorLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RequireCreator>
            {children}
        </RequireCreator>
    );
};

export default CreatorLayout;