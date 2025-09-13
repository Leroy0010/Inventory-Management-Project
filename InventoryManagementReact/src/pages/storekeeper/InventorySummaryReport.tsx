import { useState, useMemo } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useInventorySummaryReport, useInventorySummaryStats, useInventorySummaryReportExport } from '@/hooks/queries/useInventorySummaryReport';
import InventorySummaryReportForm from '@/components/inventory-summary-report/InventorySummaryReportForm';
import InventorySummaryReportTable from '@/components/inventory-summary-report/InventorySummaryReportTable';
import InventorySummaryStats from '@/components/inventory-summary-report/InventorySummaryStats';
import type { 
  InventorySummaryReportFilters,
  InventorySummaryReportRequest,
  InventorySummaryItemDto
} from '@/types/inventorySummaryReport';
import InventorySummaryHeader from '@/components/inventory-summary-report/InventorySummaryHeader';
import InventorysummaryEmptyState from '@/components/inventory-summary-report/InventorysummaryEmptyState';

export default function InventorySummaryReport() {
  const { hasPermission } = usePermissions();
  const [currentFilters, setCurrentFilters] = useState<InventorySummaryReportFilters | null>(null);
  const [reportData, setReportData] = useState<InventorySummaryItemDto[]>([]);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const {
    generateReport,
    generateReportAsync,
    isGenerating,
    error: generationError,
    reset: resetGeneration
  } = useInventorySummaryReport();

  const { exportToCSV } = useInventorySummaryReportExport();

  // Convert filters to API request format
  const apiRequest = useMemo((): InventorySummaryReportRequest | null => {
    if (!currentFilters) return null;

    const { inventorySummaryType, costFlowMethod, officeId, dateRange } = currentFilters;
    
    const request: InventorySummaryReportRequest = {
      inventorySummaryType,
      costFlowMethod,
      officeId,
    };

    // Add date parameters based on type
    switch (dateRange.type) {
      case 'year':
        if (dateRange.year) {
          request.year = dateRange.year;
        }
        break;
      case 'yearRange':
        if (dateRange.startYear && dateRange.endYear) {
          request.startYear = dateRange.startYear;
          request.endYear = dateRange.endYear;
        }
        break;
      case 'custom':
        if (dateRange.startDate && dateRange.endDate) {
          request.startDate = dateRange.startDate;
          request.endDate = dateRange.endDate;
        }
        break;
    }

    return request;
  }, [currentFilters]);

  // Get summary statistics
  const { data: stats, isLoading: statsLoading } = useInventorySummaryStats(reportData);

  // Determine if this is a quantity or value report
  const isQuantityReport = useMemo(() => {
    return currentFilters?.inventorySummaryType === 'BY_QUANTITY';
  }, [currentFilters]);

  const handleGenerateReport = async (filters: InventorySummaryReportFilters) => {
    setCurrentFilters(filters);
    resetGeneration();

    try {
      const request = apiRequest;
      if (!request) {
        throw new Error('Invalid report parameters');
      }

      const data = await generateReportAsync(request);
      setReportData(data);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleExport = () => {
    if (reportData.length === 0) {
      return;
    }

    const filename = `inventory-summary-${isQuantityReport ? 'quantity' : 'value'}-${new Date().toISOString().split('T')[0]}.csv`;
    const result = exportToCSV(reportData, filename);
    
    if (!result.success) {
      console.error('Export failed:', result.error);
    }
  };

  const handleRefresh = () => {
    if (currentFilters) {
      handleGenerateReport(currentFilters);
    }
  };

  if (!hasPermission('VIEW_INVENTORY_SUMMARY_REPORTS')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have permission to view inventory summary reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <InventorySummaryHeader reportData={reportData} isGenerating={isGenerating} handleExport={handleExport} handleRefresh={handleRefresh} />

      {/* Report Form */}
      <InventorySummaryReportForm
        onGenerate={handleGenerateReport}
        onExport={handleExport}
        isLoading={isGenerating}
      />

      {/* Error Display */}
      {generationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate report: {generationError.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {lastGenerated && reportData.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Report generated successfully on {lastGenerated.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Statistics */}
      {reportData.length > 0 && (
        <InventorySummaryStats
          stats={stats}
          isLoading={statsLoading}
          isQuantityReport={isQuantityReport}
        />
      )}

      {/* Report Table */}
      <InventorySummaryReportTable
        data={reportData}
        isLoading={isGenerating}
        error={generationError?.message}
      />

      {/* Empty State */}
      {!isGenerating && reportData.length === 0 && !generationError && <InventorysummaryEmptyState />}
    </div>
  );
}
