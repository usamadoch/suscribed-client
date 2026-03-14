import { useEffect, useRef, useCallback } from "react";

interface OmitEmpty {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
}

export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin = "200px",
}: OmitEmpty) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(observerCallback, { rootMargin });
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [observerCallback, rootMargin]);

    return { sentinelRef };
}
