import { api, handleApiError } from './client';
import type {
    UserReportRequest,
    UserReportItemDto,
    UserReportResponse,
    UserReportFilters,
} from '@/types/userReport';

// User Report API functions based on Spring Boot UserReportController
export const userReportApi = {
    // Get user report for a specific user and year/date range (updated Spring Boot implementation)
    getUserReport: async (
        filters: UserReportFilters
    ): Promise<UserReportResponse> => {
        try {
            const params = new URLSearchParams();
            if (filters.userId)
                params.append('userId', filters.userId.toString());
            if (filters.year) params.append('year', filters.year.toString());
            if (filters.startDate)
                params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder)
                params.append('sortOrder', filters.sortOrder);

            const queryString = params.toString();
            const url = queryString
                ? `/reports/user?${queryString}`
                : '/reports/user';
            return await api.get<UserReportResponse>(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Export user report to CSV format
     * @param report - User report data to export
     * @param filename - Optional filename
     */
    exportToCSV: (report: UserReportResponse, filename?: string): void => {
        if (!report || report.items.length === 0) {
            throw new Error('No data to export');
        }

        // CSV headers
        const headers = ['Item ID', 'Item Name', 'Unit', 'Quantity Received'];

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...report.items.map((item) =>
                [
                    item.itemId,
                    `"${item.itemName}"`,
                    `"${item.unit}"`,
                    item.quantityReceived,
                ].join(',')
            ),
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `user-report-${report.userDetails.fullName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Export detailed user report to CSV with user details and summary
     * @param report - User report data to export
     * @param filename - Optional filename
     */
    exportDetailedToCSV: (
        report: UserReportResponse,
        filename?: string
    ): void => {
        if (!report || report.items.length === 0) {
            throw new Error('No data to export');
        }

        // Create detailed CSV content with user info and summary
        const userInfo = [
            'User Report Details',
            '',
            'User Information',
            `Name,${report.userDetails.fullName}`,
            `Email,${report.userDetails.email}`,
            `ID,${report.userDetails.id}`,
            `Phone,${report.userDetails.phone || 'N/A'}`,
            `Office,${report.userDetails.officeName || 'N/A'}`,
            '',
            'Summary',
            `Total Items,${report.totalItems}`,
            `Total Quantity,${report.totalQuantity}`,
            '',
            'Item Details',
            'Item ID,Item Name,Unit,Quantity Received',
        ];

        const itemData = report.items.map((item) =>
            [
                item.itemId,
                `"${item.itemName}"`,
                `"${item.unit}"`,
                item.quantityReceived,
            ].join(',')
        );

        const csvContent = [...userInfo, ...itemData].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `detailed-user-report-${report.userDetails.fullName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
};
