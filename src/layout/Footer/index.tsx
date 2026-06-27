import Link from "next/link";
import Icon from "@/components/Icon";
// import ToggleTheme from "./ToggleTheme";

const navigations = [
    {
        title: "Privacy Policy",
        url: "/",
    },
    {
        title: "License",
        url: "/",
    },
    {
        title: "API",
        url: "/",
    },
];

type FooterProps = {};

const Footer = ({ }: FooterProps) => (
    <footer className="border-t dark:border-n-6">
        <div className="flex items-center h-16 px-16 max-w-360 mx-auto 2xl:px-8 lg:px-6 md:px-5">
            <button className="inline-flex items-center mr-8 text-xs font-bold dark:fill-white transition-colors  md:mr-auto ">
                <Icon className="mr-1.5 fill-inherit" name="earth" />
                English
            </button>
            <div className="flex mr-auto">
                {navigations.map((link, index) => (
                    <Link
                        className="mr-8 text-xs font-bold transition-colors dark:text-n-9 last:mr-0 md:mr-4"
                        href={link.url}
                        key={index}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>
            <div className="text-xs font-bold dark:text-n-8">
                © {new Date().getFullYear()} Commons. All rights reserved.
            </div>
            {/* <ToggleTheme /> */}
        </div>
    </footer>
);

export default Footer;
