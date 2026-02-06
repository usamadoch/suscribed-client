import { useParams, notFound } from "next/navigation";

export const usePageSlug = (): string => {
    const params = useParams<{ "page-slug": string }>();
    const slug = params["page-slug"];

    if (!slug) {
        notFound();
    }

    return slug;
};
