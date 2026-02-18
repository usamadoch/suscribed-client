"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export type HeaderConfig = {
    title?: string;
    createBtn?: boolean;
    back?: boolean;
    onBack?: (() => void) | null;
    headerVariant?: "default" | "public";
};

const defaultConfig: HeaderConfig = {
    title: undefined,
    createBtn: true,
    back: false,
    onBack: null,
    headerVariant: "default",
};

type HeaderContextType = {
    config: HeaderConfig;
    setHeaderConfig: (config: Partial<HeaderConfig>) => void;
    resetHeaderConfig: () => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

    const setHeaderConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    }, []);

    const resetHeaderConfig = useCallback(() => {
        setConfig(defaultConfig);
    }, []);

    return (
        <HeaderContext.Provider value={{ config, setHeaderConfig, resetHeaderConfig }}>
            {children}
        </HeaderContext.Provider>
    );
};

/**
 * Hook to read the current header config.
 */
export const useHeaderConfig = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error("useHeaderConfig must be used within a HeaderProvider");
    }
    return context.config;
};

/**
 * Hook for pages to set header config on mount and reset on unmount.
 *
 * Usage:
 * ```
 * useHeader({ title: "Posts", createBtn: true });
 * ```
 */
export const useHeader = (config: Partial<HeaderConfig>) => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error("useHeader must be used within a HeaderProvider");
    }

    const { setHeaderConfig, resetHeaderConfig } = context;

    // Serialize only the non-function values for dependency tracking
    const { onBack, ...primitiveConfig } = config;
    const serialized = JSON.stringify(primitiveConfig);

    // Keep onBack in a ref so it doesn't trigger re-renders
    const onBackRef = useRef(onBack);
    onBackRef.current = onBack;

    // Apply config on mount + whenever primitive values change
    useEffect(() => {
        setHeaderConfig({ ...JSON.parse(serialized), onBack: onBackRef.current });
    }, [serialized, setHeaderConfig]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset on unmount
    useEffect(() => {
        return () => {
            resetHeaderConfig();
        };
    }, [resetHeaderConfig]);

    // Return setHeaderConfig so pages can dynamically update mid-lifecycle
    return { setHeaderConfig };
};
