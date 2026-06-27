import Link from "next/link";







const CallToAction = () => {
    return (
        <section className="py-32 text-center max-w-3xl mx-auto border-t dark:border-n-6">
            <h2 className="text-[80px] font-normal leading-[0.85] tracking-tighter dark:text-n-9 mb-8">
                Give them a way<br />to <span className="text-amber">show up.</span>
            </h2>
            <p className="text-2xl font-normal dark:text-n-8 leading-relaxed mb-12">
                Stop making your audience work around the platform to support you.
            </p>
            <Link href="/register" className="btn btn-stroke shadow-primary-4 rounded-sm px-12 h-14">Start your page now</Link>
        </section>
    )

}


export default CallToAction;