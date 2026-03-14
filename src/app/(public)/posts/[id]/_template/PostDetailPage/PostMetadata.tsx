interface PostMetadataProps {
    viewCount: number;
}

const PostMetadata = ({ viewCount }: PostMetadataProps) => (
    <div className="flex gap-3 justify-end items-center text-sm text-n-3">
        <div className="flex gap-1">
            <strong className="text-purple-1">{viewCount}</strong> views
        </div>
    </div>
);

export default PostMetadata;
