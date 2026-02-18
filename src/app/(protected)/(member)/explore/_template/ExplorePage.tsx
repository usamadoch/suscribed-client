"use client";

import { useState, useMemo } from "react";

import Search from "@/components/Search";

import { useExploreCreators } from "./useExploreCreators";
import { useHeader } from "@/context/HeaderContext";
import Loader from "@/components/Loader";
import Item from "./Item";

export const ExplorePage = () => {
    useHeader({ title: "Explore" });
    const { creators, isLoading, error } = useExploreCreators();
    const [search, setSearch] = useState("");

    const filteredCreators = useMemo(() => {
        const query = search.toLowerCase();
        return creators.filter((creator) =>
            (creator.displayName || "").toLowerCase().includes(query) ||
            (creator.tagline || "").toLowerCase().includes(query)
        );
    }, [creators, search]);



    return (
        <>
            <div className="">
                <Search
                    className="w-full mb-5 md:w-[64%]"
                    placeholder="Search Creators..."
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    onSubmit={(e: React.FormEvent) => e.preventDefault()}
                />

                {isLoading ? (
                    <div className="flex justify-center pt-10">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : (
                    <div className="flex flex-wrap -mt-5 -mx-2.5 md:-mt-3">
                        {filteredCreators.length > 0 ? (
                            filteredCreators.map((creator) => (
                                <Item item={creator} key={creator._id} />
                            ))
                        ) : (
                            <div className="w-full text-center py-10 text-n-3">
                                No creators found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};