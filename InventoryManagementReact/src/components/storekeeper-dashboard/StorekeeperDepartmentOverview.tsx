import type { DepartmentOverview } from '@/types/dashboard';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { AlertTriangle, Building2, Clock, Package, Users } from 'lucide-react';

interface StorekeeperDepartmentOverviewProps {
    departmentOverview: DepartmentOverview | undefined;
}

export default function StorekeeperDepartmentOverview({
    departmentOverview,
}: StorekeeperDepartmentOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Department Overview
                </CardTitle>
                <CardDescription>Your department statistics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                Total Staff
                            </span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                            {departmentOverview?.totalStaff || 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                                Inventory Items
                            </span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                            {departmentOverview?.totalItems || 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">
                                Pending Requests
                            </span>
                        </div>
                        <span className="text-lg font-bold text-orange-600">
                            {departmentOverview?.pendingRequests || 0}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">
                                Low Stock
                            </span>
                        </div>
                        <span className="text-lg font-bold text-red-600">
                            {departmentOverview?.lowStockItems || 0}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
