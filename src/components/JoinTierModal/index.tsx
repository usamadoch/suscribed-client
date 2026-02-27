
import Image from "@/components/Image";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { CreatorPage, Tier } from "@/lib/types";
import { useCreatorPlans } from "@/hooks/useQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlanApi } from "@/lib/api";
import { toast } from "react-hot-toast";

type JoinTierModalProps = {
    visible: boolean;
    onClose: () => void;
    page: CreatorPage;
    onJoin: () => void;
    isJoining: boolean;
};

const JoinTierModal = ({
    visible,
    onClose,
    page,
    onJoin,
    isJoining
}: JoinTierModalProps) => {

    const creatorId = typeof page.userId === 'object' ? page.userId._id : page.userId;
    const { data: plans = [], isLoading: loadingPlans } = useCreatorPlans(creatorId);

    const queryClient = useQueryClient();

    const subscribeMutation = useMutation({
        mutationFn: async (planId: string) => {
            return await membershipPlanApi.subscribeMock(planId);
        },
        onSuccess: () => {
            toast.success('Successfully subscribed!');
            queryClient.invalidateQueries({ queryKey: ['check-member'] });
            queryClient.invalidateQueries({ queryKey: ['creator-posts'] });
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to subscribe');
        }
    });

    return (
        <Modal
            classWrap="relative border-b-none max-w-xl"
            classButtonClose="z-2 fill-white bg-black/50 p-1 rounded-full top-2 right-2"
            visible={visible}
            onClose={onClose}
        >
            <div className="relative z-1 card-title text-white">
                Unlock Exclusive Content
            </div>
            <div className="px-5 pb-7 md:pt-8 max-h-[85vh] overflow-y-auto">
                <div className="mb-6 text-center">
                    <div className="relative w-full mt-5 aspect-3/1 overflow-hidden bg-n-2 dark:bg-n-7 rounded-t-xl">
                        <Image
                            className="object-cover"
                            family="banner"
                            slot="creatorPage"
                            src={page.bannerUrl}
                            fill
                            alt="Banner"
                        />
                    </div>

                    <div className="relative z-1 -mt-10 w-20 h-20 mx-auto mb-3 border-4 border-white rounded-full dark:border-n-1 bg-n-1">
                        <Image
                            className="object-cover rounded-full"
                            family="avatar"
                            slot="profile"
                            src={page.avatarUrl}
                            fill
                            alt="Creator Avatar"
                        />
                    </div>

                    <div className="text-sm font-medium text-n-1 dark:text-white mt-4 mx-4">
                        Choose a member tier to unlock content from {page.displayName}
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    {loadingPlans ? (
                        <div className="flex justify-center p-4"><Loader /></div>
                    ) : plans.length > 0 ? (
                        plans.map((plan: Tier) => (
                            <div key={plan._id} className="border border-n-3/20 dark:border-white/10 rounded-xl p-5 hover:border-purple-500 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-n-1 dark:text-white">{plan.name}</h3>
                                    <span className="font-black text-xl text-n-1 dark:text-white">
                                        ${(plan.price / 100).toFixed(2)}<span className="text-sm font-normal text-n-3">/mo</span>
                                    </span>
                                </div>
                                <p className="text-sm text-n-3 mb-4">{plan.description}</p>
                                {plan.benefits?.length > 0 && (
                                    <ul className="mb-5 space-y-1">
                                        {plan.benefits.map((b, i) => (
                                            <li key={i} className="text-sm text-n-1 dark:text-white flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    className="btn-purple btn-medium w-full"
                                    onClick={() => subscribeMutation.mutate(plan._id)}
                                    disabled={subscribeMutation.isPending}
                                >
                                    {subscribeMutation.isPending && subscribeMutation.variables === plan._id ? <Loader /> : <span>Subscribe</span>}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-n-3 mb-4">This creator hasn't published any subscription tiers yet.</p>
                            <button
                                className="btn-stroke btn-medium w-full"
                                onClick={onJoin}
                                disabled={isJoining}
                            >
                                {isJoining ? <Loader /> : <span>Follow for free instead</span>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default JoinTierModal;
