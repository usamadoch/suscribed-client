








import Layout from "@/layout";
import { ExplorePage } from "./_template/ExplorePage";

export default function Explore() {
    return (
        <Layout requireAuth={false}>
            <ExplorePage />
        </Layout>
    );
}
