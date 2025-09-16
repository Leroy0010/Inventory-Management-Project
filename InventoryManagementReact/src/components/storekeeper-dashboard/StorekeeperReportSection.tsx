import { Activity, BarChart3, FileText, TrendingUp, Users } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export default function StorekeeperReportSection() {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Reports
                </CardTitle>
                <CardDescription>
                    Generate and view department reports
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => navigate('/reports/inventory-summary')}
                    >
                        <TrendingUp className="h-6 w-6" />
                        <span className="font-medium">Inventory Summary</span>
                        <span className="text-xs text-gray-500">
                            View inventory reports
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => navigate('/reports/user-activity')}
                    >
                        <Activity className="h-6 w-6" />
                        <span className="font-medium">User Activity</span>
                        <span className="text-xs text-gray-500">
                            Track user activities
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => navigate('/reports/user')}
                    >
                        <Users className="h-6 w-6" />
                        <span className="font-medium">User Report</span>
                        <span className="text-xs text-gray-500">
                            View User Report
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => navigate('/reports/transaction')}
                    >
                        <FileText className="h-6 w-6" />
                        <span className="font-medium">Transaction Report</span>
                        <span className="text-xs text-gray-500">
                            View transactions
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
