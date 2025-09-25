import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import type { TransactionReport } from '@/types/transactionReports';

interface TransactionReportHeaderProps {
    report: TransactionReport;
    onExportCSV: () => void;
    onExportDetailedCSV: () => void;
    onExportJSON: () => void;
}

export function TransactionReportHeader({
    report,
    onExportCSV,
    onExportDetailedCSV,
    onExportJSON,
}: TransactionReportHeaderProps) {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction Report - {report.itemName}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                        Unit: {report.unitOfMeasurement} | Item ID:{' '}
                        {report.itemId}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onExportCSV}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export CSV (Simple)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onExportDetailedCSV}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Export CSV (Detailed)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onExportJSON}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
    );
}
