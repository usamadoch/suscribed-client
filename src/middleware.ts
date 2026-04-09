import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ======================
// NEXT.JS MIDDLEWARE
// ======================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only redirect if visiting root path /
    if (pathname === "/") {
        const accessToken = request.cookies.get("accessToken")?.value;

        if (accessToken) {
            try {
                // Decode the JWT payload safely to get the role
                // Note: We don't verify the signature here for performance, 
                // but any fake data will fail on the next server-side/client-side API call.
                const parts = accessToken.split(".");
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    const role = payload?.role;

                    if (role === "creator") {
                        // Redirect creator to dashboard
                        return NextResponse.redirect(new URL("/dashboard", request.url));
                    }
                }
            } catch (error) {
                console.error("[Middleware] JWT Decode Error:", error);
            }
        }
    }

    return NextResponse.next();
}

// Optimization: Match only the paths that need checking
export const config = {
    matcher: ["/"],
};
