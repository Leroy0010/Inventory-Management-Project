import { Button } from '@/components/ui/button';
import { Download, Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportActionsProps {
    onGenerate: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    canExport?: boolean;
    hasData?: boolean;
    isFormValid?: boolean;
    className?: string;
}

export function ReportActions({
    onGenerate,
    onExport,
    onRefresh,
    isLoading = false,
    canExport = false,
    hasData = false,
    isFormValid = true,
    className,
}: ReportActionsProps) {
    return (
        <div className={cn('flex flex-col sm:flex-row gap-2', className)}>
            {/* Generate Report Button */}
            <Button
                onClick={onGenerate}
                disabled={isLoading || !isFormValid}
                className="flex-1 sm:flex-none"
            >
                {isLoading ? (
                    <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Report
                    </>
                )}
            </Button>

            {/* Refresh Button */}
            {onRefresh && (
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            )}

            {/* Export Button */}
            {canExport && onExport && hasData && (
                <Button
                    variant="outline"
                    onClick={onExport}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            )}
        </div>
    );
}
