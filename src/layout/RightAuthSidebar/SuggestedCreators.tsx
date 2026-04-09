import { useExploreCreators } from "@/app/explore/_template/useExploreCreators";
import Image from "@/components/Image";
import Loader from "@/components/Loader";
import Link from "next/link";






const SuggestedCreators = () => {
    const { creators, isLoading } = useExploreCreators();

    const suggestedCreators = creators.slice(0, 4);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-6">
                <Loader />
            </div>
        );
    }

    if (suggestedCreators.length === 0) return null;

    return (
        <div className=" bg-white dark:bg-n-4 border border-n-6 p-6 mt-6">
            <h6 className="text-h6 font-bold mb-5 dark:text-n-9">Creators you may like</h6>

            <div className="flex flex-col gap-6">
                {suggestedCreators.map(item => (
                    <div key={item._id} className="flex">
                        <div className="flex items-center w-full">
                            <div className="relative w-16 h-16 shrink-0">
                                <Image
                                    className="object-cover rounded-3xl"
                                    family="avatar"
                                    slot="profile"
                                    src={item.avatarUrl}
                                    fill
                                    alt={item.displayName}
                                />
                            </div>

                            <div className="ml-4 min-w-0 flex-1">
                                <div className="text-base font-bold truncate">{item.displayName}</div>
                                <div className="text-xs font-medium text-n-3 dark:text-n-8 line-clamp-2">
                                    {item.tagline}
                                </div>
                                <Link href={`/${item.pageSlug}`} className="btn-stroke btn-small h-6 mt-2">View</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default SuggestedCreators;