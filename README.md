This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.










  <div className="flex items-center mr-8 space-x-5 md:mr-4 md:space-x-3">
            {displayedLinks.map((link, index) => {
                const iconPath = getSocialIcon(link.platform);

                return (
                    <Link
                        key={index}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        className="group relative shrink-0"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {iconPath ? (
                            <div className="relative w-7 h-7 shadow-primary-4 rounded-full transition-shadow duration-100 group-hover:shadow-none">
                                <Image
                                    src={iconPath}
                                    fill
                                    alt={link.platform}
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <Icon
                                className="w-5 h-5 fill-n-4 transition-colors group-hover:fill-purple-1 dark:fill-n-3"
                                name={link.platform === 'website' ? 'link' : link.platform}
                            />
                        )}
                    </Link>
                );
            })}
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-block ml-1 font-semibold text-purple-1 dark:text-white cursor-pointer text-sm"
                >
                    {isExpanded ? "Less" : "More"}
                </button>
            )}
        </div>






         <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* <div className="card-title">Social profiles</div> */}
            <h3 className="mb-5 text-h3 text-n-1 dark:text-n-9">Connect your socials</h3>

            <div className="">
                <div>
                    {socialProfiles.map((item) => (
                        <div
                            className="flex items-center mb-4 pb-4 pl-3 md:pl-0 dark:border-n-6"
                            key={item.id}
                        >
                            <Icon
                                className="shrink-0 icon-20 mr-8 md:mr-4 dark:fill-n-1"
                                name={item.icon}
                            />
                            <div className="mr-auto">
                                <div className="mb-1.5 text-xs font-medium text-n-3 dark:text-n-8">
                                    {item.label}
                                </div>
                                <div className="break-all text-sm font-bold">
                                    {item.link ? item.link : "Not connected"}
                                </div>
                            </div>
                            {!item.link && (
                                <button className="group inline-flex items-center self-end pb-0.5 text-xs font-bold cursor-pointer">
                                    <Icon
                                        className="mr-1.5 dark:fill-9"
                                        name="external-link"
                                    />
                                    Connect
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <StepActions
                onNext={handleNext}
                onBack={onBack}
                isLoading={isLoading}
                nextLabel="Finish"
                showSkip={true}
                onSkip={finishFlow}
            />
        </div>