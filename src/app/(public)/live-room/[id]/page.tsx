import LiveRoomDetailPage from "./_template/LiveRoomDetailPage";

export async function generateMetadata() {
    return {
        title: `Live Room`,
        description: `Join exclusive live stream room on commons.`,
    };
}

const LiveRoomDetail = () => {
    return <LiveRoomDetailPage />
};

export default LiveRoomDetail;