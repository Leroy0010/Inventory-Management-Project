import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventorySummaryReportApi } from '@/api/inventorySummaryReport';
import type { 
  InventorySummaryReportRequest, 
  InventorySummaryItemDto,
  InventorySummaryStats 
} from '@/types/inventorySummaryReport';

// Query keys for caching
export const inventorySummaryReportKeys = {
  all: ['inventorySummaryReports'] as const,
  lists: () => [...inventorySummaryReportKeys.all, 'list'] as const,
  list: (filters: InventorySummaryReportRequest) => 
    [...inventorySummaryReportKeys.lists(), filters] as const,
  stats: (filters: InventorySummaryReportRequest) => 
    [...inventorySummaryReportKeys.all, 'stats', filters] as const,
};

/**
 * Hook for generating inventory summary reports
 * Uses mutation since it's a POST request with parameters
 */
export function useInventorySummaryReport() {
  const queryClient = useQueryClient();

  const generateReportMutation = useMutation({
    mutationFn: (request: InventorySummaryReportRequest) => 
      InventorySummaryReportApi.generateReport(request),
    onSuccess: (data, variables) => {
      // Cache the generated report
      queryClient.setQueryData(
        inventorySummaryReportKeys.list(variables),
        data
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: inventorySummaryReportKeys.lists()
      });
    },
    onError: (error) => {
      // Failed to generate inventory summary report
    }
  });

  return {
    generateReport: generateReportMutation.mutate,
    generateReportAsync: generateReportMutation.mutateAsync,
    isGenerating: generateReportMutation.isPending,
    error: generateReportMutation.error,
    data: generateReportMutation.data,
    reset: generateReportMutation.reset
  };
}

/**
 * Hook for getting cached report data
 * @param filters - Report filters
 * @param enabled - Whether the query should be enabled
 */
export function useInventorySummaryReportData(
  filters: InventorySummaryReportRequest | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: inventorySummaryReportKeys.list(filters!),
    queryFn: () => InventorySummaryReportApi.generateReport(filters!),
    enabled: enabled && !!filters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for getting summary statistics
 * @param data - Report data
 */
export function useInventorySummaryStats(data: InventorySummaryItemDto[] | undefined) {
  return useQuery({
    queryKey: inventorySummaryReportKeys.stats({} as InventorySummaryReportRequest),
    queryFn: () => {
      if (!data || data.length === 0) {
        return {
          totalItems: 0,
          totalQuantityBroughtForward: 0,
          totalQuantityReceived: 0,
          totalQuantityIssued: 0,
          totalQuantityCarriedForward: 0,
          totalValueBroughtForward: 0,
          totalValueReceived: 0,
          totalValueIssued: 0,
          totalValueCarriedForward: 0
        } as InventorySummaryStats;
      }
      return InventorySummaryReportApi.calculateSummaryStats(data);
    },
    enabled: !!data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for yearly report generation
 * @param year - Year to generate report for
 * @param type - Report type
 * @param costFlowMethod - Cost flow method (for value reports)
 */
export function useYearlyInventorySummaryReport(
  year: number,
  type: 'quantity' | 'value',
  costFlowMethod?: 'FIFO' | 'AVG'
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => 
      InventorySummaryReportApi.generateYearlyReport(year, type, costFlowMethod),
    onSuccess: (data) => {
      // Cache the result
      const filters: InventorySummaryReportRequest = {
        year,
        inventorySummaryType: type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
        ...(type === 'value' && costFlowMethod && { costFlowMethod })
      };
      
      queryClient.setQueryData(
        inventorySummaryReportKeys.list(filters),
        data
      );
    }
  });

  return {
    generateYearlyReport: mutation.mutate,
    generateYearlyReportAsync: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    error: mutation.error,
    data: mutation.data
  };
}

/**
 * Hook for year range report generation
 * @param startYear - Start year
 * @param endYear - End year
 * @param type - Report type
 * @param costFlowMethod - Cost flow method (for value reports)
 */
export function useYearRangeInventorySummaryReport(
  startYear: number,
  endYear: number,
  type: 'quantity' | 'value',
  costFlowMethod?: 'FIFO' | 'AVG'
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => 
      InventorySummaryReportApi.generateYearRangeReport(startYear, endYear, type, costFlowMethod),
    onSuccess: (data) => {
      // Cache the result
      const filters: InventorySummaryReportRequest = {
        startYear,
        endYear,
        inventorySummaryType: type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
        ...(type === 'value' && costFlowMethod && { costFlowMethod })
      };
      
      queryClient.setQueryData(
        inventorySummaryReportKeys.list(filters),
        data
      );
    }
  });

  return {
    generateYearRangeReport: mutation.mutate,
    generateYearRangeReportAsync: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    error: mutation.error,
    data: mutation.data
  };
}

/**
 * Hook for custom date range report generation
 * @param startDate - Start date
 * @param endDate - End date
 * @param type - Report type
 * @param costFlowMethod - Cost flow method (for value reports)
 */
export function useCustomDateRangeInventorySummaryReport(
  startDate: string,
  endDate: string,
  type: 'quantity' | 'value',
  costFlowMethod?: 'FIFO' | 'AVG'
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => 
      InventorySummaryReportApi.generateCustomDateRangeReport(startDate, endDate, type, costFlowMethod),
    onSuccess: (data) => {
      // Cache the result
      const filters: InventorySummaryReportRequest = {
        startDate,
        endDate,
        inventorySummaryType: type === 'quantity' ? 'BY_QUANTITY' : 'BY_VALUE',
        ...(type === 'value' && costFlowMethod && { costFlowMethod })
      };
      
      queryClient.setQueryData(
        inventorySummaryReportKeys.list(filters),
        data
      );
    }
  });

  return {
    generateCustomDateRangeReport: mutation.mutate,
    generateCustomDateRangeReportAsync: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    error: mutation.error,
    data: mutation.data
  };
}

/**
 * Hook for report export functionality
 */
export function useInventorySummaryReportExport() {
  const exportToCSV = (data: InventorySummaryItemDto[], filename?: string) => {
    try {
      InventorySummaryReportApi.exportToCSV(data, filename);
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Export failed' 
      };
    }
  };

  return {
    exportToCSV
  };
}
