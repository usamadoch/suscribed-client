"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "../store/auth";
import { SocketProvider } from "../store/socket";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <ThemeProvider attribute="data-theme" forcedTheme="dark" enableSystem={false}>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <AuthProvider>
                        <SocketProvider>
                            <Toaster />
                            {children}
                        </SocketProvider>
                    </AuthProvider>
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
