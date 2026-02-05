


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
  title: "Modern Web App",
  description: "A premium web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>



        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
