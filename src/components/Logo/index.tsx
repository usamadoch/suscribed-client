




import Link from "next/link";
import { useColorMode } from "@chakra-ui/color-mode";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
    light?: boolean;
    href?: string;
    disabled?: boolean;
};

const Logo = ({ className, light, href = "/dashboard", disabled }: LogoProps) => {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === "dark";

    const content = (
        <Image
            className="w-full h-auto"
            src={
                light
                    ? "/images/logo-light.svg"
                    : isDarkMode
                        ? "/images/logo-light.svg"
                        : "/images/logo-dark.svg"
            }
            width={113}
            height={25}
            alt="Bruddle"
        />
    );

    if (disabled) {
        return (
            <div className={`flex w-28.5 ${className}`}>
                {content}
            </div>
        );
    }

    return (
        <Link className={`flex w-28.5 ${className}`} href={href}>
            {content}
        </Link>
    );
};

export default Logo;
