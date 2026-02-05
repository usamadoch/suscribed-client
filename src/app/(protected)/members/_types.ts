import { CreatorPage } from "@/app/[page-slug]/_types";
import { User } from "@/lib/types";





// Membership
export type MembershipStatus = 'active' | 'paused' | 'cancelled';

export interface Membership {
    _id: string;
    memberId: string | User;
    creatorId: string | User;
    pageId: string | CreatorPage;
    status: MembershipStatus;
    tier?: string;
    joinedAt: string;
    cancelledAt: string | null;
    updatedAt: string;
}


export interface JoinMembershipPayload {
    creatorId: string;
    pageId: string;
}