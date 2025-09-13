// Enums matching backend
export const InventorySummaryType = {
    BY_QUANTITY: 'BY_QUANTITY',
    BY_VALUE: 'BY_VALUE',
};

export type InventorySummaryType =
    (typeof InventorySummaryType)[keyof typeof InventorySummaryType];

export const CostFlowMethod = {
    FIFO: 'FIFO',
    AVG: 'AVG',
} as const;

export type CostFlowMethod =
    (typeof CostFlowMethod)[keyof typeof CostFlowMethod];

// Request DTO matching backend
export interface InventorySummaryReportRequest {
    // Flexible date options
    year?: number; // Optional - for single year reports
    startYear?: number; // Optional - for year range reports
    endYear?: number; // Optional - for year range reports
    startDate?: string; // Optional - for custom date range (ISO string)
    endDate?: string; // Optional - for custom date range (ISO string)

    // Required
    inventorySummaryType: InventorySummaryType; // QUANTITY or VALUE

    // Only required if inventorySummaryType == BY_VALUE
    costFlowMethod?: CostFlowMethod;

    // Optional filtering
    officeId?: number; // Optional - filter by specific office
}

// Response DTO matching backend
export interface InventorySummaryItemDto {
    inventoryId: number;
    inventoryName: string;
    unit: string;

    // Quantity fields (used if inventorySummaryType == BY_QUANTITY)
    quantityBroughtForward?: number;
    quantityReceived?: number;
    quantityIssued?: number;
    quantityCarriedForward?: number;

    // Value fields (used if inventorySummaryType == BY_VALUE)
    valueBroughtForward?: number;
    valueReceived?: number;
    valueIssued?: number;
    valueCarriedForward?: number;
}

// UI-specific types for enhanced display
export interface InventorySummaryReportFilters {
    inventorySummaryType: InventorySummaryType;
    costFlowMethod?: CostFlowMethod;
    officeId?: number;
    dateRange: {
        type: 'year' | 'yearRange' | 'custom';
        year?: number;
        startYear?: number;
        endYear?: number;
        startDate?: string;
        endDate?: string;
    };
}

// Summary statistics for dashboard display
export interface InventorySummaryStats {
    totalItems: number;
    totalQuantityBroughtForward: number;
    totalQuantityReceived: number;
    totalQuantityIssued: number;
    totalQuantityCarriedForward: number;
    totalValueBroughtForward: number;
    totalValueReceived: number;
    totalValueIssued: number;
    totalValueCarriedForward: number;
}

// Report generation state
export interface ReportGenerationState {
    isGenerating: boolean;
    error: string | null;
    lastGenerated: Date | null;
}

// Export options
export interface ExportOptions {
    format: 'csv' | 'excel' | 'pdf';
    includeCharts: boolean;
    includeSummary: boolean;
}
