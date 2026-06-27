import React from "react";

const PrivacyPage = () => {
    return (
        <main className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12">
            <div className="flex flex-col gap-2 border-b border-n-4 dark:border-n-6 pb-12">
                <h1 className="text-[48px] font-normal tracking-tighter leading-[0.85] text-n-1 dark:text-n-9">
                    Commons Privacy Policy
                </h1>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8">

                    <p>Last Updated: June 27, 2026</p>
                </div>
            </div>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">1. What Information We Collect</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    To make Commons work, we collect the following basic information:
                </p>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8 leading-relaxed pl-6 border-l-2 border-purple-1">
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Account Information:</strong> Your name, email, profile picture, and login credentials.</p>
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Financial Information:</strong> When you pay for a subscription or tip, or when you receive payouts as a creator, we collect necessary routing data. We do not store full credit card numbers; these are passed securely to our payment processors (JazzCash, Easypaisa, and local banking partners).</p>
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Usage Data:</strong> Basic information about how you interact with the site to help us fix bugs and improve performance.</p>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">2. How We Use Your Information</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    We use your information exclusively to provide the Commons service. This includes processing payments, sending you receipt emails, notifying you about messages or new content, and keeping your account secure.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">3. Sharing Your Information</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    We do not sell your personal data to advertisers or third parties. We only share data with trusted partners necessary to run the platform, such as payment gateways (to process transactions) and secure cloud servers (to host the website and your content).
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">4. Cookies</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    We use standard browser cookies to keep you logged into your account and to maintain your session securely. You can disable cookies in your browser settings, but parts of the Commons platform will no longer function properly.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">5. Your Rights and Deletion</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    You own your data. You can update your profile information at any time from your account settings.
                    If you wish to permanently delete your Commons account and erase your personal data from our active servers,
                    please contact us at <a href="mailto:support@commons.pk" className="text-purple-1 hover:underline">support@commons.pk</a>.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">6. Data Retention</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Transaction and payment records are retained for 6 years as required by applicable tax and financial regulations, even if you delete your account.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">7. Payment Security</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Payment information is processed through PCI-DSS compliant payment partners. Commons does not store full card numbers.
                </p>
            </section>
        </main>
    );
};

export default PrivacyPage;
