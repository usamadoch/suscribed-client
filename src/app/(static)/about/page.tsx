import Footer from "@/layout/Footer";
import CommunityFocus from "./_components/CommunityFocus";
import CreatorToolkit from "./_components/CreatorToolkit";
import CallToAction from "./_components/CallToAction";
import Hero from "./_components/Hero";
import ProblemStatement from "./_components/ProblemStatement";
import PlatformFreedom from "./_components/PlatformFreedom";
import LocalPricing from "./_components/LocalPricing";

const About = () => {
    return (
        <>
            <Hero />
            <ProblemStatement />
            <CreatorToolkit />

            <PlatformFreedom />
            <CommunityFocus />
            <CallToAction />

            <LocalPricing />

            <Footer />
        </>
    );
};

export default About;