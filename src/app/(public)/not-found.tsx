"use client";

import { useEffect } from "react";
import { useCreatorHeader } from "@/context/CreatorHeaderContext";

export default function NotFound() {
    const { setHeaderHidden } = useCreatorHeader();

    useEffect(() => {
        setHeaderHidden(true);
        return () => setHeaderHidden(false);
    }, [setHeaderHidden]);

    return (
        <div className="flex items-center justify-center h-screen bg-n-1 text-white">
            <div className="text-center">
                <h1 className="text-h3 mb-2">404 - Page Not Found</h1>
                <p className="text-n-3">The page you are looking for does not exist.</p>
            </div>
        </div>
    );
}
