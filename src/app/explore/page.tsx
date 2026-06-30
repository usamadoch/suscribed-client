








import Layout from "@/layout";
import { ExplorePage } from "./_template/ExplorePage";

export const metadata = {
    description: "Explore top creators, active channels, and popular posts on commons.",
};

export default function Explore() {
    return (
        <Layout requireAuth={false}>
            <ExplorePage />
        </Layout>
    );
}
