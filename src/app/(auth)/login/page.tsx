



import LoginPage from "./_template";

import { RedirectIfAuthenticated } from "../../../store/auth";

const SigninPage = () => {

    return (
        <RedirectIfAuthenticated>
            <h4 className="mb-6 text-h4 dark:text-n-9 mobile:text-center">Sign in or Sign up</h4>
            {/* <p className="mb-6 text-sm text-n-2 dark:text-n-8">
                Enter your email to continue
            </p> */}


            <LoginPage />
            <div className="mt-12 text-sm"></div>
        </RedirectIfAuthenticated>
    );
};

export default SigninPage;
