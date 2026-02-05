




import Link from "next/link";
import RegistrationPage from "./_template";

const Registration = () => {
    return (
        <>
            <RegistrationPage />
            <div className="mt-12 text-sm">
                Not a Creator?

                <Link
                    href="/login"
                    className="ml-1.5 font-bold transition-colors hover:text-purple-1"
                >
                    Join as a Member
                </Link>
            </div>
        </>
    );
};

export default Registration;
