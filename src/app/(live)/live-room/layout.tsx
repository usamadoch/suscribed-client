

import Sidebar from "@/layout/Sidebar";
import { RequireCreator } from "@/store/auth";

export default function LiveRoomNewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RequireCreator>

            <div className="relative flex pl-20 md:pl-0 md:pb-20 bg-n-1">
                <Sidebar isMinimize={true} />
                <div className="flex flex-col grow w-full min-h-screen md:pt-0">
                    <div className="flex grow w-full">
                        <div className="flex flex-col grow w-full mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </RequireCreator>
    );
}
