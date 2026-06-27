




const ProblemStatement = () => {
    return (
        <section className="border-y border-n-6 dark:bg-n-3 py-20">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-5xl font-normal tracking-tight dark:text-n-9 leading-snug mb-10">
                    WhatsApp groups and bank transfers only scale so far.
                </h2>
                <div className="space-y-8 text-2xl dark:text-n-8 leading-relaxed font-normal">
                    <p>
                        Most creators in Pakistan run their business through screenshots and manual verification.
                        Someone pays, someone checks, someone adds them to a group by hand.
                        <br /> <strong className="dark:text-n-9">It works — until you have a hundred people to manage.</strong>
                    </p>
                    {/* <p>
                        Supporting someone on an international platform means paying for exchange rates, hidden bank fees, and the inflation gap.
                        A small gesture in dollars becomes a heavy burden in rupees.
                    </p> */}
                    <p>
                        And on live streams? If your audience is mostly Pakistani, that door is closed.
                        YouTube's Super Chat isn't available here, leaving money on the table every single time you go live.
                    </p>
                    <p className="dark:text-purple-2 font-semibold text-2xl pt-4">
                        Commons runs natively in PKR, giving your audience the exact same premium experience at a
                        price that actually respects their wallet.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ProblemStatement;