import { User } from "@/lib/types";





// ====================
// AUTH TYPES
// ====================


export interface SignupPayload {
    email: string;
    password: string;
    displayName: string;
    username: string;
    role?: 'member' | 'creator';
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}