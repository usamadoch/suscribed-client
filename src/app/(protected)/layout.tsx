import Layout from "@/layout";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout>
            {children}
        </Layout>
    );
};

export default ProtectedLayout;