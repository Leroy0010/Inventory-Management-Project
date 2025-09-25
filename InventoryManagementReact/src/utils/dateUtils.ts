/**
 * Date utility functions for consistent date handling across the application
 * All dates from the backend are ISO strings from LocalDateTime
 */

/**
 * Format an ISO date string to a localized date string
 * @param dateString - ISO date string from backend
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
    dateString: string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format an ISO date string to a short date format (MM/DD/YYYY)
 * @param dateString - ISO date string from backend
 * @returns Short date string
 */
export function formatShortDate(dateString: string): string {
    return formatDate(dateString, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * Format an ISO date string to a time format (HH:MM AM/PM)
 * @param dateString - ISO date string from backend
 * @returns Time string
 */
export function formatTime(dateString: string): string {
    return formatDate(dateString, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format an ISO date string to a relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string from backend
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 31536000)
            return `${Math.floor(diffInSeconds / 2592000)} months ago`;

        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return 'Invalid Date';
    }
}

/**
 * Check if a date string is valid
 * @param dateString - ISO date string from backend
 * @returns True if valid, false otherwise
 */
export function isValidDate(dateString: string): boolean {
    if (!dateString) return false;

    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    } catch {
        return false;
    }
}

/**
 * Convert an ISO date string to a Date object
 * @param dateString - ISO date string from backend
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
    if (!dateString) return null;

    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

/**
 * Get current date as ISO string
 * @returns Current date as ISO string
 */
export function getCurrentDateISO(): string {
    return new Date().toISOString();
}

/**
 * Format date for API requests (YYYY-MM-DD format)
 * @param dateString - ISO date string
 * @returns Date in YYYY-MM-DD format
 */
export function formatDateForAPI(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error formatting date for API:', error);
        return '';
    }
}

/**
 * Format date range for display
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return 'N/A';

    const start = formatShortDate(startDate);
    const end = formatShortDate(endDate);

    return `${start} - ${end}`;
}

/**
 * Check if a date is today
 * @param dateString - ISO date string
 * @returns True if date is today
 */
export function isToday(dateString: string): boolean {
    if (!dateString) return false;

    try {
        const date = new Date(dateString);
        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    } catch {
        return false;
    }
}

/**
 * Check if a date is yesterday
 * @param dateString - ISO date string
 * @returns True if date is yesterday
 */
export function isYesterday(dateString: string): boolean {
    if (!dateString) return false;

    try {
        const date = new Date(dateString);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
    } catch {
        return false;
    }
}
