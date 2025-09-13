import { AxiosError } from 'axios';

export interface ApiError {
    message: string;
    statusCode?: number;
    details?: any;
}

/**
 * Formats API errors into a consistent structure
 */
export function formatApiError(error: unknown): ApiError {
    // Handle Axios errors
    if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        let message = 'An unexpected error occurred';

        // Try to extract error message from response
        if (error.response?.data) {
            const data = error.response.data;
            
            // Check for common error message fields
            if (typeof data === 'string') {
                message = data;
            } else if (data.message) {
                message = data.message;
            } else if (data.error) {
                message = data.error;
            } else if (data.error_description) {
                message = data.error_description;
            } else if (data.details) {
                message = data.details;
            }
        } else if (error.message) {
            message = error.message;
        }

        // Add status code context to message
        if (statusCode) {
            message = `[${statusCode}] ${message}`;
        }

        return {
            message,
            statusCode,
            details: error.response?.data,
        };
    }

    // Handle generic errors
    if (error instanceof Error) {
        return {
            message: error.message,
        };
    }

    // Handle unknown error types
    return {
        message: 'An unexpected error occurred',
        details: error,
    };
}

/**
 * Gets user-friendly error messages for common scenarios
 */
export function getFriendlyErrorMessage(error: ApiError): string {
    const { message, statusCode } = error;

    // Network errors
    if (message.includes('Network Error') || message.includes('timeout')) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Authentication errors
    if (statusCode === 401) {
        return 'Your session has expired. Please log in again.';
    }

    if (statusCode === 403) {
        return 'You do not have permission to perform this action.';
    }

    // Validation errors
    if (statusCode === 400) {
        return 'Please check your input and try again.';
    }

    // Server errors
    if (statusCode && statusCode >= 500) {
        return 'The server is experiencing issues. Please try again later.';
    }

    // Not found errors
    if (statusCode === 404) {
        return 'The requested resource was not found.';
    }

    // Return the original message if no specific handling
    return message;
}

/**
 * Gets a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    
    if (typeof error === 'string') {
        return error;
    }
    
    const apiError = formatApiError(error);
    return apiError.message;
}
