



import { Suspense } from "react";

import MessagesPage from "./_template/MessagesPage";
import Loader from "@/components/Loader";

const Messages = () => {
    return (
        <Suspense fallback={<Loader text="Loading..." />}>
            <MessagesPage />
        </Suspense>
    );
};

export default Messages;