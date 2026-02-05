import { fetchApi } from '@/lib/api';
import type { User } from '@/lib/types';
import { ChangePasswordPayload, LoginPayload, SignupPayload } from './_types';

export const authApi = {
    async signup(payload: SignupPayload): Promise<{ user: User }> {
        return fetchApi('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(payload: LoginPayload): Promise<{ user: User }> {
        return fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async googleLogin(code: string, role?: string): Promise<{ user: User; isNewUser: boolean }> {
        return fetchApi('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ code, role }),
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

    async getMe(): Promise<{ user: User }> {
        return fetchApi('/auth/me');
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
};
