"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UseFormRegister, FieldErrors, FormState } from "react-hook-form";
import Field from "@/components/Field";

type AuthFieldsProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    touchedFields?: FormState<any>["touchedFields"];
    dirtyFields?: FormState<any>["dirtyFields"];
    showName?: boolean;
    showEmail?: boolean;
    showPassword?: boolean;
    emailReadOnly?: boolean;
    className?: string; // e.g. "gap-6" or "gap-4"
    nameAutoFocus?: boolean;
    emailAutoFocus?: boolean;
    passwordAutoFocus?: boolean;
    onExitComplete?: () => void;
};

const AuthFields = ({
    register,
    errors,
    touchedFields,
    dirtyFields,
    showName = false,
    showEmail = true,
    showPassword = false,
    emailReadOnly = false,
    className = "gap-4 mb-4",
    nameAutoFocus = false,
    emailAutoFocus = false,
    passwordAutoFocus = false,
    onExitComplete,
}: AuthFieldsProps) => {
    // Only show error for a field if the user actually interacted with it
    const getError = (fieldName: string) => {
        if (touchedFields || dirtyFields) {
            const isTouched = touchedFields?.[fieldName];
            const isDirty = dirtyFields?.[fieldName];
            if (!isTouched && !isDirty) return undefined;
        }
        return errors[fieldName];
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <AnimatePresence initial={false} onExitComplete={onExitComplete}>
                {showName && (
                    <motion.div
                        key="name-field"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <Field
                            classInput="h-12"
                            placeholder="Full Name"
                            type="text"
                            icon="profile"
                            error={getError("displayName")}
                            autoFocus={nameAutoFocus}
                            required
                            {...register("displayName")}
                        />
                    </motion.div>
                )}

                {showEmail && (
                    <motion.div
                        key="email-field"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <Field
                            classInput="h-12"
                            type="email"
                            placeholder="Email address"
                            icon="email"
                            error={getError("email")}
                            autoFocus={emailAutoFocus}
                            required
                            readOnly={emailReadOnly}
                            {...register("email")}
                        />
                    </motion.div>
                )}

                {showPassword && (
                    <motion.div
                        key="password-field"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <Field
                            classInput="h-12"
                            type="password"
                            placeholder="Password"
                            icon="lock"
                            error={getError("password")}
                            autoFocus={passwordAutoFocus}
                            required
                            {...register("password")}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthFields;
