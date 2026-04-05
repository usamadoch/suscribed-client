




import Layout from "@/layout";
import { RootHomePage } from "./_template/RootHomePage";

export default function Home() {
    return (
        <Layout requireAuth={false}>
            <RootHomePage />
        </Layout>
    );
}
