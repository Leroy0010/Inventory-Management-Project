import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    AxiosError,
} from 'axios';

// API Configuration
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // Important for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        // No CSRF token handling needed - using JWT tokens for authentication
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        // Handle 401 errors (unauthorized) - but only for authenticated requests
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth-related endpoints to avoid infinite loops
            const authEndpoints = [
                '/auth/login',
                '/auth/google',
                '/auth/refresh',
                '/auth/logout',
                '/csrf-token',
            ];
            const isAuthEndpoint = authEndpoints.some((endpoint) =>
                originalRequest.url?.includes(endpoint)
            );

            if (!isAuthEndpoint) {
                originalRequest._retry = true;

                try {
                    // Attempt to refresh token
                    await apiClient.post('/auth/refresh');

                    // Retry original request
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, redirect to login only if not already on login page
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// API Error class
export class ApiError extends Error {
    public status: number;
    public data: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Generic API response type
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// HTTP Methods
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.get(url, config).then((response) => response.data),

    post: <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.post(url, data, config).then((response) => response.data),

    put: <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.put(url, data, config).then((response) => response.data),

    patch: <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.patch(url, data, config).then((response) => response.data),

    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.delete(url, config).then((response) => response.data),
};

// Error handler utility
export const handleApiError = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        const status = error.response?.status;

        switch (status) {
            case 400:
                return `Bad Request: ${message}`;
            case 401:
                return message || 'Unauthorized. Please log in again.';
            case 403:
                return (
                    message ||
                    `Access denied. You do not have permission to perform this action: ${message}`
                );
            case 404:
                return message ||  'Resource not found.';
            case 422:
                return message || `Validation Error: ${message}`;
            case 500:
                return message || 'Internal server error. Please try again later.';
            default:
                return message || 'An unexpected error occurred.';
        }
    }

    return 'An unexpected error occurred.';
};

export default apiClient;
