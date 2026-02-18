import Loader from "@/components/Loader";

/**
 * Loading placeholder shown in the post content area
 * while the post data is being fetched.
 * The creator header renders independently above this.
 */
const PostLoadingSkeleton = () => (
    <div className="w-full h-96 flex items-center justify-center">
        <Loader />
    </div>
);

export default PostLoadingSkeleton;
