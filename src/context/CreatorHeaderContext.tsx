"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CreatorHeaderContextType = {
    isHeaderHidden: boolean;
    setHeaderHidden: (hidden: boolean) => void;
};

const CreatorHeaderContext = createContext<CreatorHeaderContextType | undefined>(undefined);

export const CreatorHeaderProvider = ({ children }: { children: ReactNode }) => {
    const [isHeaderHidden, setHeaderHidden] = useState(false);

    return (
        <CreatorHeaderContext.Provider value={{ isHeaderHidden, setHeaderHidden }}>
            {children}
        </CreatorHeaderContext.Provider>
    );
};

export const useCreatorHeader = () => {
    const context = useContext(CreatorHeaderContext);
    if (context === undefined) {
        throw new Error("useCreatorHeader must be used within a CreatorHeaderProvider");
    }
    return context;
};
