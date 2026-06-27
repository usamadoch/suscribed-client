import { Newspaper, Mic, GraduationCap, Gamepad2 } from "@/lib/icons";
import { Icon } from "@/components/ui/icon";

const communities = [
    {
        icon: <Icon icon={Newspaper} size={32} className="text-n-9" strokeWidth={2} />,
        title: "Political & Current Affairs",
        description: "Audiences that loyally follow every episode, but have nowhere to back it financially.",
    },
    {
        icon: <Icon icon={Mic} size={32} className="text-n-9" strokeWidth={2} />,
        title: "Scholars & Speakers",
        description: "Running live Q&As, discussions, and exclusive lectures for a devoted community.",
    },
    {
        icon: <Icon icon={GraduationCap} size={32} className="text-n-9" strokeWidth={2} />,
        title: "Teachers & Tutors",
        description: "Building a paying, dedicated student base around lessons and direct access.",
    },
    {
        icon: <Icon icon={Gamepad2} size={32} className="text-n-9" strokeWidth={2} />,
        title: "Gaming & Live",
        description: "Creators with an interactive audience who've been waiting for a Super Chat alternative.",
    },
];

const CommunityFocus = () => {
    return (
        <section className="py-20 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-5xl leading-[0.85] font-normal tracking-tight dark:text-n-9 mb-4">Built for communities.</h2>
                <p className="text-2xl dark:text-n-8">For creators whose audience already wants to support them.</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {communities.map((community, index) => (
                    <div key={index} className="dark:bg-n-3 p-8 rounded-md ">
                        <div className="text-3xl dark:bg-n-4 shadow-primary-4 rounded-sm inline-block px-6 py-3 mb-6">
                            {community.icon}
                        </div>
                        <div className="text-xl font-normal dark:text-n-9 mb-3">{community.title}</div>
                        <div className="text-base dark:text-n-8 leading-relaxed">{community.description}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CommunityFocus;
