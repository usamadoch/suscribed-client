"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type AuthTransitionState = {
    /** Whether an animated transition is in progress */
    isTransitioning: boolean;
    /** Signal the start of a register → login morph */
    startTransition: () => void;
    /** Called once the transition animation is complete */
    completeTransition: () => void;
    /** Reverses the transition (login → register) maintaining centered layout while fields expand */
    startReverseTransition: () => void;
    /** Reset everything back to initial state (e.g. browser back to /register) */
    resetTransition: () => void;
    /** True after a transition has completed (login should appear centered, no re-animation) */
    hasTransitioned: boolean;
    /** True while a reverse transition is occurring */
    isReversing: boolean;
};

const AuthTransitionContext = createContext<AuthTransitionState>({
    isTransitioning: false,
    startTransition: () => { },
    completeTransition: () => { },
    startReverseTransition: () => { },
    resetTransition: () => { },
    hasTransitioned: false,
    isReversing: false,
});

export function AuthTransitionProvider({ children }: { children: React.ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasTransitioned, setHasTransitioned] = useState(false);
    const [isReversing, setIsReversing] = useState(false);

    const startTransition = useCallback(() => {
        setIsTransitioning(true);
        setIsReversing(false);
    }, []);

    const completeTransition = useCallback(() => {
        setIsTransitioning(false);
        setHasTransitioned(true);
    }, []);

    const startReverseTransition = useCallback(() => {
        setIsReversing(true);
        setIsTransitioning(true); // Keep layout centered

        // Phase 1: Registration form un-morphs for 1.6s
        // Phase 2: Layout slides back and unblurs
        setTimeout(() => {
            setIsTransitioning(false); // Trigger layout slide
            setHasTransitioned(false);

            // Phase 3: Transition finishes
            setTimeout(() => {
                setIsReversing(false);
            }, 2800); // 2.8s slide duration
        }, 1600); // 1.6s morph duration
    }, []);

    const resetTransition = useCallback(() => {
        setIsTransitioning(false);
        setHasTransitioned(false);
        setIsReversing(false);
    }, []);

    return (
        <AuthTransitionContext.Provider
            value={{
                isTransitioning,
                startTransition,
                completeTransition,
                startReverseTransition,
                resetTransition,
                hasTransitioned,
                isReversing
            }}
        >
            {children}
        </AuthTransitionContext.Provider>
    );
}

export const useAuthTransition = () => useContext(AuthTransitionContext);
