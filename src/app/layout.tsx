


import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Roboto_Flex } from "next/font/google";


import { Providers } from "./providers";

const roboto = Roboto_Flex({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-roboto",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};


export const metadata: Metadata = {
  title: "Commons",
  description: "Join Commons to access exclusive posts, private creator communities, live streams, and connect directly with your favorite creators.",
  keywords: ["Commons", "creator platform", "exclusive content", "private communities", "creator support", "fan club", "interactive streams"],
  authors: [{ name: "Commons" }],
  creator: "Commons",
  publisher: "Commons",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://commons.pk",
    siteName: "Commons",
    title: "Commons — Connect with Creators & Exclusive Communities",
    description: "Access exclusive posts, join private communities, and connect directly with top creators on Commons.",
    images: [
      {
        url: "/l.svg",
        width: 800,
        height: 800,
        alt: "Commons logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commons — Connect with Creators & Exclusive Communities",
    description: "Access exclusive posts, join private communities, and connect directly with top creators on Commons.",
    images: ["/l.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>



        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
