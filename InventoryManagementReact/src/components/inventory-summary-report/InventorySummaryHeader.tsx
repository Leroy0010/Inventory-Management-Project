import { Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import type { InventorySummaryItemDto } from '@/types/inventorySummaryReport';

interface InventorySummaryHeaderProps {
    reportData: InventorySummaryItemDto[];
    handleRefresh: () => void;
    isGenerating: boolean;
    handleExport: () => void;
}

export default function InventorySummaryHeader({
    reportData,
    handleExport,
    handleRefresh,
    isGenerating,
}: InventorySummaryHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Inventory Summary Report
                </h1>
                <p className="text-muted-foreground">
                    Generate comprehensive inventory reports by quantity or
                    value
                </p>
            </div>
            <div className="flex items-center space-x-2">
                {reportData.length > 0 && (
                    <>
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isGenerating}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`}
                            />
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={reportData.length === 0}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
