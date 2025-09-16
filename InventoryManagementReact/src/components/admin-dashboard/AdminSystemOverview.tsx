import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                                Database
                            </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                            Healthy
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                                API Services
                            </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                            Running
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                                Authentication
                            </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                            Active
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
