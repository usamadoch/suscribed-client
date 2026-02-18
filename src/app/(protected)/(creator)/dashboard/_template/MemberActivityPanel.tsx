import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Icon from "@/components/Icon";
import { User, CreatorPage, MembershipStatus } from "@/lib/types";
import { useAnalyticsOverview, useMyMembers } from "@/hooks/useQueries";
import Loader from "@/components/Loader";

// Domain model for the view
interface RecentMemberViewModel {
    _id: string;
    user: User;
    status: MembershipStatus;
    joinedAt: string;
}

interface MemberActivityPanelProps {
    page: CreatorPage;
}

const MemberActivityPanel = ({ page }: MemberActivityPanelProps) => {
    const { data: overview } = useAnalyticsOverview(7);
    const { data: membersData, isLoading } = useMyMembers({ page: 1, limit: 5 });

    // Use explicit fallbacks based on data availability
    // page.memberCount is guaranteed by the type
    const totalMembers = overview ? overview.totalMembers : page.memberCount;
    const newMembers = overview ? overview.newMembers : 0;

    // Type guard to ensure we have full user objects
    const hasFullUserData = (membership: any): membership is { memberId: User } => {
        return membership.memberId && typeof membership.memberId !== 'string';
    };

    const recentMembers: RecentMemberViewModel[] = (membersData?.memberships || [])
        .filter(hasFullUserData)
        .map((m) => ({
            _id: m._id,
            user: m.memberId as User,
            status: m.status,
            joinedAt: m.joinedAt,
        }));

    return (
        <div className="card p-5 mt-4">
            <div className="flex items-center gap-3 mb-4">
                <Icon name="team" className="w-5 h-5 fill-purple-1" />
                <h3 className="font-semibold text-n-1 dark:text-white">Members</h3>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center pt-5">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3 py-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Total members</span>
                            <span className="font-bold text-lg text-n-1 dark:text-white">
                                {totalMembers}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">New this week</span>
                            <span className="font-medium text-green-500">+{newMembers}</span>
                        </div>
                    </div>

                    <hr className="border-t border-n-6 my-3" />
                    <div className="py-3">
                        <h4 className="text-sm font-bold mb-3">Recent Activity</h4>
                        {recentMembers.length > 0 ? (
                            <div className="space-y-3">
                                {recentMembers.slice(0, 5).map((member) => (
                                    <div key={member._id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-1/20 flex items-center justify-center overflow-hidden">
                                            {member.user.avatarUrl ? (
                                                <img
                                                    src={member.user.avatarUrl}
                                                    alt={member.user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Icon name="profile" className="w-6 h-6 fill-purple-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-n-1 dark:text-white truncate">
                                                @{member.user.username}
                                            </div>
                                            <div className="text-xs text-n-3">
                                                {member.status === 'active' ? 'joined' : 'left'} •{" "}
                                                {formatDistanceToNow(new Date(member.joinedAt), {
                                                    addSuffix: true,
                                                })}
                                            </div>
                                        </div>
                                        <div
                                            className={`w-2 h-2 rounded-full ${member.status === 'active'
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-n-4">No recent activity</p>
                        )}
                    </div>

                    <Link
                        href="/members"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-1 hover:text-purple-2 transition-colors"
                    >
                        <span>View all members</span>
                        <Icon name="arrow-next" className="w-4 h-4" />
                    </Link>
                </>
            )}
        </div>
    );
};

export default MemberActivityPanel;
