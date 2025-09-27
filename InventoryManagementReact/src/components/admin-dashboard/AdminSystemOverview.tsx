import { BarChart3 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';

export default function AdminSystemOverview() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Overview
                </CardTitle>
                <CardDescription>Key metrics and system status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Database
                            </span>
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Healthy
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                API Services
                            </span>
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Running
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Authentication
                            </span>
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Active
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
