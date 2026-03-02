"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Field from "@/components/Field";

type AuthFieldsProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    showName?: boolean;
    showEmail?: boolean;
    showPassword?: boolean;
    emailReadOnly?: boolean;
    className?: string; // e.g. "gap-6" or "gap-4"
    nameAutoFocus?: boolean;
    emailAutoFocus?: boolean;
    passwordAutoFocus?: boolean;
};

const AuthFields = ({
    register,
    errors,
    showName = false,
    showEmail = true,
    showPassword = false,
    emailReadOnly = false,
    className = "gap-6 mb-4",
    nameAutoFocus = false,
    emailAutoFocus = false,
    passwordAutoFocus = false,
}: AuthFieldsProps) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <AnimatePresence initial={false} mode="popLayout">
                {showName && (
                    <motion.div
                        key="name-field"
                        layout
                        initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
                    >
                        <Field
                            classInput="h-12"
                            placeholder="Full Name"
                            type="text"
                            icon="profile"
                            error={errors.displayName}
                            autoFocus={nameAutoFocus}
                            required
                            {...register("displayName")}
                        />
                    </motion.div>
                )}

                {showEmail && (
                    <motion.div
                        key="email-field"
                        layout
                        initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
                    >
                        <Field
                            classInput="h-12"
                            type="email"
                            placeholder="Email address"
                            icon="email"
                            error={errors.email}
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
                        layout
                        initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
                    >
                        <Field
                            classInput="h-12"
                            type="password"
                            placeholder="Password"
                            icon="lock"
                            error={errors.password}
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
