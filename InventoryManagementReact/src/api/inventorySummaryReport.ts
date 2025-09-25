import { api, handleApiError } from './client';
import { formatShortDate } from '@/utils/dateUtils';
import type {
    InventorySummaryReportRequest,
    InventorySummaryItemDto,
} from '@/types/inventorySummaryReport';

/**
 * Inventory Summary Report API
 * Handles all API calls related to inventory summary reports
 */
export class InventorySummaryReportApi {
    private static readonly BASE_URL = '/reports/inventory-summary';

    /**
     * Generate inventory summary report
     * @param request - Report generation parameters
     * @returns Promise<InventorySummaryItemDto[]>
     */
    static async generateReport(
        request: InventorySummaryReportRequest
    ): Promise<InventorySummaryItemDto[]> {
        try {
            const response = await api.post<InventorySummaryItemDto[]>(
                this.BASE_URL,
                request
            );
            return response;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Generate report for a specific year
     * @param year - Year to generate report for
     * @param type - Report type (quantity or value)
     * @param costFlowMethod - Cost flow method (only for value reports)
     * @returns Promise<InventorySummaryItemDto[]>
     */
    static async generateYearlyReport(
        year: number,
        type: 'quantity' | 'value',
        costFlowMethod?: 'FIFO' | 'AVG'
    ): Promise<InventorySummaryItemDto[]> {
        const request: InventorySummaryReportRequest = {
            year,
            inventorySummaryType:
                type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
            ...(type === 'value' && costFlowMethod && { costFlowMethod }),
        };

        return this.generateReport(request);
    }

    /**
     * Generate report for a year range
     * @param startYear - Start year
     * @param endYear - End year
     * @param type - Report type (quantity or value)
     * @param costFlowMethod - Cost flow method (only for value reports)
     * @returns Promise<InventorySummaryItemDto[]>
     */
    static async generateYearRangeReport(
        startYear: number,
        endYear: number,
        type: 'quantity' | 'value',
        costFlowMethod?: 'FIFO' | 'AVG'
    ): Promise<InventorySummaryItemDto[]> {
        const request: InventorySummaryReportRequest = {
            startYear,
            endYear,
            inventorySummaryType:
                type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
            ...(type === 'value' && costFlowMethod && { costFlowMethod }),
        };

        return this.generateReport(request);
    }

    /**
     * Generate report for custom date range
     * @param startDate - Start date (ISO string)
     * @param endDate - End date (ISO string)
     * @param type - Report type (quantity or value)
     * @param costFlowMethod - Cost flow method (only for value reports)
     * @returns Promise<InventorySummaryItemDto[]>
     */
    static async generateCustomDateRangeReport(
        startDate: string,
        endDate: string,
        type: 'quantity' | 'value',
        costFlowMethod?: 'FIFO' | 'AVG'
    ): Promise<InventorySummaryItemDto[]> {
        const request: InventorySummaryReportRequest = {
            startDate,
            endDate,
            inventorySummaryType:
                type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
            ...(type === 'value' && costFlowMethod && { costFlowMethod }),
        };

        return this.generateReport(request);
    }

    /**
     * Export report to CSV format
     * @param data - Report data to export
     * @param filename - Optional filename
     */
    static exportToCSV(
        data: InventorySummaryItemDto[],
        filename?: string
    ): void {
        if (data.length === 0) {
            throw new Error('No data to export');
        }

        // Get headers based on data structure
        // Check if quantity fields have actual values (not null/undefined)
        const isQuantityReport =
            data[0].quantityBroughtForward !== null &&
            data[0].quantityBroughtForward !== undefined;
        const headers = isQuantityReport
            ? [
                  'Inventory ID',
                  'Inventory Name',
                  'Unit',
                  'Brought Forward',
                  'Received',
                  'Issued',
                  'Carried Forward',
              ]
            : [
                  'Inventory ID',
                  'Inventory Name',
                  'Unit',
                  'Value Brought Forward (GHS)',
                  'Value Received (GHS)',
                  'Value Issued (GHS)',
                  'Value Carried Forward (GHS)',
              ];

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...data.map((item) => {
                if (isQuantityReport) {
                    return [
                        item.inventoryId,
                        `"${item.inventoryName}"`,
                        `"${item.unit}"`,
                        item.quantityBroughtForward ?? 0,
                        item.quantityReceived ?? 0,
                        item.quantityIssued ?? 0,
                        item.quantityCarriedForward ?? 0,
                    ].join(',');
                } else {
                    return [
                        item.inventoryId,
                        `"${item.inventoryName}"`,
                        `"${item.unit}"`,
                        item.valueBroughtForward ?? 0,
                        item.valueReceived ?? 0,
                        item.valueIssued ?? 0,
                        item.valueCarriedForward ?? 0,
                    ].join(',');
                }
            }),
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
                `inventory-summary-report-${formatShortDate(new Date().toISOString())}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Calculate summary statistics from report data
     * @param data - Report data
     * @returns Summary statistics
     */
    static calculateSummaryStats(data: InventorySummaryItemDto[]) {
        // Check if quantity fields have actual values (not null/undefined)
        const isQuantityReport =
            data[0]?.quantityBroughtForward !== null &&
            data[0]?.quantityBroughtForward !== undefined;

        if (isQuantityReport) {
            return {
                totalItems: data.length,
                totalQuantityBroughtForward: data.reduce(
                    (sum, item) => sum + (item.quantityBroughtForward ?? 0),
                    0
                ),
                totalQuantityReceived: data.reduce(
                    (sum, item) => sum + (item.quantityReceived ?? 0),
                    0
                ),
                totalQuantityIssued: data.reduce(
                    (sum, item) => sum + (item.quantityIssued ?? 0),
                    0
                ),
                totalQuantityCarriedForward: data.reduce(
                    (sum, item) => sum + (item.quantityCarriedForward ?? 0),
                    0
                ),
                totalValueBroughtForward: 0,
                totalValueReceived: 0,
                totalValueIssued: 0,
                totalValueCarriedForward: 0,
            };
        } else {
            return {
                totalItems: data.length,
                totalQuantityBroughtForward: 0,
                totalQuantityReceived: 0,
                totalQuantityIssued: 0,
                totalQuantityCarriedForward: 0,
                totalValueBroughtForward: data.reduce(
                    (sum, item) => sum + (item.valueBroughtForward ?? 0),
                    0
                ),
                totalValueReceived: data.reduce(
                    (sum, item) => sum + (item.valueReceived ?? 0),
                    0
                ),
                totalValueIssued: data.reduce(
                    (sum, item) => sum + (item.valueIssued ?? 0),
                    0
                ),
                totalValueCarriedForward: data.reduce(
                    (sum, item) => sum + (item.valueCarriedForward ?? 0),
                    0
                ),
            };
        }
    }
}

// Export individual functions for convenience
export const {
    generateReport,
    generateYearlyReport,
    generateYearRangeReport,
    generateCustomDateRangeReport,
    exportToCSV,
    calculateSummaryStats,
} = InventorySummaryReportApi;
