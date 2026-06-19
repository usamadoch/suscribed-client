"use client";

import LiveHeader from "../_components/LiveHeader";
import LiveLayout from "../_components/LiveLayout";
import LiveSettings from "../_components/LiveSettings";
import StreamPlayer from "../_components/StreamPlayer";
import { useLiveRoomForm } from "./useLiveRoomForm";
import { useMyPage } from "@/hooks/queries/usePageQueries";

const NewLiveRoomPage = () => {
    const formState = useLiveRoomForm();
    const { data: page } = useMyPage();

    const isPagePublished = page?.status === 'published';
    const isStartLiveDisabled = !isPagePublished || !formState.isConnected || formState.isSubmitting;

    let disabledReason = undefined;
    if (!isPagePublished) {
        disabledReason = "Page must be published to go live";
    }

    return (
        <LiveLayout
            leftClassName="mx-5"
            sidebarClassName="w-100 overflow-y-auto scrollbar-none"
            sidebar={<LiveSettings formState={formState} />}
        >
            <LiveHeader
                backTitle="Cancel"
                showStartLive
                startLiveDisabled={isStartLiveDisabled}
                startLiveDisabledReason={disabledReason}
                onStartLive={formState.handleSubmit}
            />

            <StreamPlayer
                streamLink={formState.streamLink}
                setStreamLink={formState.setStreamLink}
                isConnected={formState.isConnected}
                onConnect={formState.handleConnect}
                onDisconnect={formState.handleDisconnect}
            />
        </LiveLayout>
    );
};

export default NewLiveRoomPage;