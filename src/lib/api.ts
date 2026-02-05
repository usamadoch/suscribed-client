import { ApiError, ApiResponse } from "./types";








// API base URL - Hardcoded for debugging as requested
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class for API errors
export class ApiClientError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: Record<string, string[]>;

    constructor(error: ApiError, status: number) {
        super(error.message);
        this.name = 'ApiClientError';
        this.code = error.code;
        this.status = status;
        this.details = error.details;
    }
}

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Core fetch wrapper with error handling and auto-refresh
 */
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // Always send cookies
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (options.body instanceof FormData) {
        delete (config.headers as Record<string, string>)['Content-Type'];
    }

    let response: Response;

    try {
        response = await fetch(url, config);
    } catch (error) {
        // Network error (server unreachable, CORS blocked, etc.)
        console.error('[API] Network error:', error);
        throw new ApiClientError(
            { code: 'NETWORK_ERROR', message: 'Unable to connect to server' },
            0
        );
    }

    // Handle 401 - try to refresh token (but not for auth endpoints)
    // Endpoints that should NOT trigger a token refresh on 401
    const NO_REFRESH_ENDPOINTS = [
        '/auth/login',
        '/auth/signup',
        '/auth/check-email',
        '/auth/google',
        '/auth/refresh'
    ];

    const skipRefresh = NO_REFRESH_ENDPOINTS.some(path => endpoint.startsWith(path));
    if (response.status === 401 && !skipRefresh) {
        const refreshed = await refreshTokens();
        if (refreshed) {
            // Retry original request
            try {
                response = await fetch(url, config);
            } catch (error) {
                console.error('[API] Network error on retry:', error);
                throw new ApiClientError(
                    { code: 'NETWORK_ERROR', message: 'Unable to connect to server' },
                    0
                );
            }
        }
    }

    let data: ApiResponse<T>;
    try {
        data = await response.json() as ApiResponse<T>;
    } catch {
        // Response is not valid JSON
        throw new ApiClientError(
            { code: 'PARSE_ERROR', message: 'Invalid response from server' },
            response.status
        );
    }

    if (!data.success) {
        throw new ApiClientError(data.error, response.status);
    }

    return data.data;
}

/**
 * Refresh access token using refresh token
 */
async function refreshTokens(): Promise<boolean> {
    // If already refreshing, wait for the existing promise
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            return response.ok;
        } catch {
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}