



import { Suspense } from "react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import MessagesPage from "./_template/MessagesPage";

const Messages = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MessagesPage />
        </Suspense>
    );
};

export default Messages;