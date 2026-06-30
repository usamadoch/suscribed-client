import { ReactNode } from "react";
import { Metadata } from "next";
import { pageService } from "@/services/page.service";

type Props = {
    params: Promise<{
        "page-slug": string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams["page-slug"];

    let name = slug.charAt(0).toUpperCase() + slug.slice(1);
    try {
        const data = await pageService.getBySlug(slug);
        if (data?.page?.displayName) {
            name = data.page.displayName;
        }
    } catch (error) {
        console.error("[generateMetadata] API error for slug:", slug, error);
        // Fallback to capitalized slug if api is unavailable
    }

    // Capitalize name (Title Case)
    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    const seoString = `Welcome to the exclusive posts, join private communities, and connect directly with ${name} on Commons.`;

    return {
        description: seoString,
    };
}

export default function CreatorLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
