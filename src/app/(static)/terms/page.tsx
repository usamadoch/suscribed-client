import React from "react";

const TermsPage = () => {
    return (
        <main className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12">
            <div className="flex flex-col gap-2 border-b border-n-4 dark:border-n-6 pb-12">
                <h1 className="text-[48px] font-normal tracking-tighter leading-[0.85] text-n-1 dark:text-n-9">
                    Terms and Conditions
                </h1>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8">

                    <p>Last Updated: June 27, 2026</p>
                </div>
            </div>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">1. Welcome to Commons</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Commons is a platform that allows creators to earn income directly from their audience through monthly or annually subscriptions and live one-off payments. By using Commons, you agree to these terms. If you are using Commons on behalf of a business, you agree to these terms on behalf of that business.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">2. Your Account and Content</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    You are responsible for keeping your account secure. As a creator, you retain full ownership of all the content you post, upload, or share on Commons. However, to operate the platform, you grant us a license to host, format, and display this content to your audience. You agree not to post content that is illegal, incites violence, or violates the rights of others.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">3. Payments, Subscriptions, and Tips</h2>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8 leading-relaxed pl-6 border-l-2 border-purple-1">
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Pricing & Currency:</strong> All transactions on Commons are processed in Pakistani Rupees (PKR). If a user pays with an international card, their bank will automatically handle the currency conversion at their respective exchange rates.</p>
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Subscriptions:</strong> When a user subscribes to a creator's tier, they will be billed recursively on a monthly basis until canceled.</p>
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Live Tipping (Super Messages):</strong> Users may send one-off, non-recurring payments during live streams. These are voluntary contributions to the creator.</p>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">4. Delivery and Fulfillment Policy</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Because Commons facilitates the transaction of digital goods and services, fulfillment is immediate. Upon a successful payment, subscribers instantly receive digital access to the creator’s premium feed, exclusive content, and private chat communities. Live stream tips are displayed instantly on-screen upon successful transaction.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">5. Refund and Cancellation Policy</h2>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8 leading-relaxed pl-6 border-l-2 border-purple-1">
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Cancellations:</strong> Subscribers can cancel their monthly recurring memberships at any time through their account dashboard. Upon cancellation, access to premium content will remain active until the end of the current billing cycle.</p>
                    <p><strong className="font-bold text-n-1 dark:text-n-9">Refunds:</strong> Because access to digital content is granted immediately, all sales—including monthly subscriptions and one-off live tips—are final and non-refundable. If you believe your card was charged fraudulently, please contact our support team immediately.</p>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">6. Platform Fees</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Commons charges a platform fee on transactions processed through the site to cover hosting, development, and operational costs. This fee is deducted automatically before funds are transferred to the creator's connected bank or wallet.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">7. Customer Support and Contact</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    If you have a billing dispute, a technical issue, or need to report an account, our support team is ready to help. You can reach us at: <a href="mailto:support@commons.pk" className="text-purple-1 hover:underline">support@commons.pk</a>. We aim to respond to all inquiries within 48 hours.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">8. Age Requirement</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    You must be at least 18 years old to use Commons.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">9. Prohibited Content</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    The following content is not permitted on Commons:
                </p>
                <div className="flex flex-col gap-2 text-base font-normal text-n-3 dark:text-n-8 leading-relaxed pl-6 border-l-2 border-purple-1">
                    <p>• Explicit adult or sexual content</p>
                    <p>• Gambling or betting services</p>
                    <p>• Scams, impersonation, or fraudulent offers</p>
                    <p>• Content that promotes hate, violence, or discrimination based on race, religion, gender, or other protected characteristics</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <p className="text-base font-bold text-n-1 dark:text-n-9">Financial and Trading Content</p>
                    <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                        Creators offering financial commentary, market analysis, or trading-related content must include a disclaimer stating that such content is for informational purposes only and does not constitute financial advice. Commons does not verify, endorse, or guarantee the accuracy of any financial content. Creators are solely responsible for compliance with applicable securities and financial regulations in their jurisdiction.
                    </p>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">10. Merchant of Record</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Commons is the merchant of record for all transactions processed on the platform. When you subscribe to a creator or send a Super Message, your payment is made to Commons, not directly to the creator. Commons then transfers the creator's earnings, minus applicable platform fees, according to our payout schedule.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">11. Chargebacks and Disputes</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    If you believe a charge was made in error, contact Commons support before filing a dispute with your bank or card issuer. Commons will work with you to resolve billing issues directly. Filing a chargeback without first contacting support, or filing a fraudulent chargeback, may result in suspension of your account and loss of access to any content or communities you've joined.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">12. Super Messages — Not a Game of Chance</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    Super Messages are a fixed-price purchase that highlights your message during a creator's livestream. The price and outcome are fixed and disclosed before payment. Super Messages do not involve chance, wagering, or randomized rewards of any kind.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-normal tracking-tight text-n-1 dark:text-n-9">13. International Card Payments</h2>
                <p className="text-base font-normal text-n-3 dark:text-n-8 leading-relaxed">
                    If you pay with a card issued outside Pakistan, your bank will convert the charge to your local currency at their exchange rate, and may apply an additional international transaction fee.
                </p>
            </section>
        </main>
    );
};

export default TermsPage;
