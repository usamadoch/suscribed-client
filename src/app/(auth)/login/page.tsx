



import LoginPage from "./_template";

import { RedirectIfAuthenticated } from "../_store/auth";

const SigninPage = () => {

    return (
        <RedirectIfAuthenticated>
            <div className="mb-1 text-h1">Sign in</div>
            <div className="mb-12 text-sm text-n-2 dark:text-white/50">
                Enter your email to continue
            </div>


            <LoginPage />
            <div className="mt-12 text-sm"></div>
        </RedirectIfAuthenticated>
    );
};

export default SigninPage;
