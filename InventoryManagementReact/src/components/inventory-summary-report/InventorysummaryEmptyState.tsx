import { Card, CardContent } from '../ui/card';
import { FileText } from 'lucide-react';

export default function InventorysummaryEmptyState() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                    No Report Generated
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                    Configure the report parameters above and click "Generate
                    Report" to view inventory summary data.
                </p>
            </CardContent>
        </Card>
    );
}
