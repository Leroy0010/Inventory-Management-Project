import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportActionButtonsProps {
    isLoading: boolean;
    onExport?: () => void;
}

export function ReportActionButtons({
    isLoading,
    onExport,
}: ReportActionButtonsProps) {
    return (
        <div className="flex items-center space-x-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
            {onExport && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onExport}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                </Button>
            )}
        </div>
    );
}
