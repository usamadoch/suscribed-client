
import { fetchApi } from "./api.client";
import { SignupPayload, AuthUser, LoginPayload, User, ChangePasswordPayload } from "@/types";

export const authService = {
    async signup(payload: SignupPayload): Promise<{ user: AuthUser }> {
        return fetchApi('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(payload: LoginPayload): Promise<{ user: AuthUser }> {
        return fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async googleLogin(code: string, role?: string): Promise<{ user: AuthUser; isNewUser: boolean }> {
        return fetchApi('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ code, role }),
        });
    },

    async fetchYoutubeChannels(code: string): Promise<{ channels: any[], token: string }> {
        return fetchApi('/auth/youtube/channels', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },

    async connectYoutube(channelId: string, secureToken: string): Promise<{ success: boolean; message: string }> {
        return fetchApi('/auth/youtube/connect', {
            method: 'POST',
            body: JSON.stringify({ channelId, secureToken }),
        });
    },

    async disconnectYoutube(): Promise<{ success: boolean; message: string }> {
        return fetchApi('/auth/youtube/disconnect', {
            method: 'POST',
        });
    },

    async checkEmail(email: string): Promise<{ exists: boolean }> {
        return fetchApi('/auth/check-email', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async logout(): Promise<{ message: string }> {
        return fetchApi('/auth/logout', {
            method: 'POST',
        });
    },

    async getMe(): Promise<{ user: AuthUser }> {
        return fetchApi('/auth/me');
    },

    async getFullProfile(): Promise<{ user: User }> {
        return fetchApi('/auth/me/full');
    },

    async refresh(): Promise<{ message: string }> {
        return fetchApi('/auth/refresh', {
            method: 'POST',
        });
    },

    async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
        return fetchApi('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async updateOnboardingStep(step: number): Promise<{ user: AuthUser }> {
        return fetchApi('/auth/onboarding-step', {
            method: 'PATCH',
            body: JSON.stringify({ step }),
        });
    },
};
