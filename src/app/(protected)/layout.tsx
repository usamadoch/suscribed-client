import Layout from "@/layout";
import { HeaderProvider } from "@/context/HeaderContext";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderProvider>
            <Layout>
                {children}
            </Layout>
        </HeaderProvider>
    );
};

export default ProtectedLayout;