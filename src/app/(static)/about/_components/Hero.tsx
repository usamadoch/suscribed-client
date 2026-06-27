import Link from "next/link";




const Hero = () => {
    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-16 max-w-300 mx-auto text-center">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-n-9 dark:bg-n-3 border dark:border-n-6 text-[11px] font-bold tracking-widest uppercase mb-10">
                Built for Pakistan
            </div> */}
            <h1 className="text-[108px] font-normal dark:text-n-9 leading-[0.85] tracking-tighter mb-8">
                Turn your audience<br />into <span className="text-purple-2">income.</span>
            </h1>
            <p className="text-2xl font-medium dark:text-n-8 leading-relaxed max-w-2xl mx-auto mb-12">
                One page. PKR in, PKR out.
                For the creators whose audience already wants to support them — but never had a frictionless way to do it.
            </p>

            <Link href="/register" className="btn-purple btn-shadow rounded-sm px-12 h-14">Start your page — it's free</Link>
        </section>
    );
};
export default Hero;