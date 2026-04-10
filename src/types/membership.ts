
import { User } from './user';
import { CreatorPage } from './page';

export type MembershipStatus = 'active' | 'paused' | 'cancelled';

export interface Member {
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

export type PayoutStatus = 'pending_review' | 'approved' | 'rejected';
export type IdType = 'id_card' | 'driving_license' | 'passport';

export interface PayoutMethod {
    _id: string;
    userId: string | User;
    pageId: string | CreatorPage;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    bankName: string;
    accountHolderName: string;
    iban: string;
    idType: IdType;
    idNumber: string;
    status: PayoutStatus;
    rejectionReason?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type TierStatus = 'draft' | 'published';

export interface Tier {
    _id: string;
    creatorId: string | User;
    pageId: string | CreatorPage;
    name: string;
    price: number;
    description: string;
    benefits: string[];
    badgeTitle?: string;
    isHighlighted: boolean;
    status: TierStatus;
    activeSubscribers: number;
    safepayPlanId?: string;
    safepayYearlyPlanId?: string;
    stripePriceId?: string;
    createdAt: string;
    updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete';

export interface Subscription {
    _id: string;
    userId: string | User;
    creatorId: string | User;
    planId: string | Tier;
    status: SubscriptionStatus;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    canceledAt?: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    createdAt: string;
    updatedAt: string;
}
