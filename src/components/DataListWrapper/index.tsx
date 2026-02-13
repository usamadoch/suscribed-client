
import { ReactNode } from "react";
import Loader from "../Loader";

interface DataListWrapperProps {
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string | null;
    children: ReactNode;
}

const DataListWrapper = ({
    isLoading,
    isError,
    errorMessage,
    children
}: DataListWrapperProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Loader text="Loading..." />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                {errorMessage || "Failed to load data"}
            </div>
        );
    }

    return <>{children}</>;
};

export default DataListWrapper;
