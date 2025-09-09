import axios, {
   type  AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    AxiosError,
} from 'axios';

// API Configuration
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    (config) => {
        // Add any request modifications here
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

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await apiClient.post('/api/auth/refresh');

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API Error class
export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(message: string, status: number, data?: any) {
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
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.post(url, data, config).then((response) => response.data),

    put: <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.put(url, data, config).then((response) => response.data),

    patch: <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient.patch(url, data, config).then((response) => response.data),

    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.delete(url, config).then((response) => response.data),
};

// Error handler utility
export const handleApiError = (error: any): string => {
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
                return 'Unauthorized. Please log in again.';
            case 403:
                return 'Access denied. You do not have permission to perform this action.';
            case 404:
                return 'Resource not found.';
            case 422:
                return `Validation Error: ${message}`;
            case 500:
                return 'Internal server error. Please try again later.';
            default:
                return message || 'An unexpected error occurred.';
        }
    }

    return 'An unexpected error occurred.';
};

export default apiClient;
