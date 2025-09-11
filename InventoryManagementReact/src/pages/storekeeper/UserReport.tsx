import { useState, useMemo } from 'react';
import { useUserReportQueries } from '@/hooks/queries/useUserReport';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import UserReportFilters from '@/components/user-report/UserReportFilters';
import UserReportTable from '@/components/user-report/UserReportTable';
import type { UserReportFilters as UserReportFiltersType, UserReportSummary } from '@/types/userReport';

export default function UserReport() {
    const [filters, setFilters] = useState<UserReportFiltersType>({});
    const [isLoading, setIsLoading] = useState(false);

    const { getAllUsersReportQuery } = useUserReportQueries();
    const { departmentsQuery } = useDepartmentQueries();

    // For now, we'll simulate the data since the backend doesn't support the full functionality
    // In a real implementation, this would come from the API
    const mockData: UserReportSummary[] = useMemo(() => {
        // This would be replaced with actual API data
        return [
            {
                userId: 1,
                userName: 'John Doe',
                userEmail: 'john.doe@company.com',
                departmentName: 'IT Department',
                totalItemsReceived: 15,
                totalQuantityReceived: 150,
                items: [
                    { inventoryCode: 1001, inventoryName: 'Laptop', unit: 'pcs', quantityReceived: 5 },
                    { inventoryCode: 1002, inventoryName: 'Mouse', unit: 'pcs', quantityReceived: 10 },
                    { inventoryCode: 1003, inventoryName: 'Keyboard', unit: 'pcs', quantityReceived: 8 },
                ],
            },
            {
                userId: 2,
                userName: 'Jane Smith',
                userEmail: 'jane.smith@company.com',
                departmentName: 'IT Department',
                totalItemsReceived: 12,
                totalQuantityReceived: 120,
                items: [
                    { inventoryCode: 1001, inventoryName: 'Laptop', unit: 'pcs', quantityReceived: 3 },
                    { inventoryCode: 1004, inventoryName: 'Monitor', unit: 'pcs', quantityReceived: 6 },
                    { inventoryCode: 1005, inventoryName: 'Headphones', unit: 'pcs', quantityReceived: 3 },
                ],
            },
            {
                userId: 3,
                userName: 'Bob Johnson',
                userEmail: 'bob.johnson@company.com',
                departmentName: 'HR Department',
                totalItemsReceived: 8,
                totalQuantityReceived: 80,
                items: [
                    { inventoryCode: 1006, inventoryName: 'Desk', unit: 'pcs', quantityReceived: 2 },
                    { inventoryCode: 1007, inventoryName: 'Chair', unit: 'pcs', quantityReceived: 4 },
                    { inventoryCode: 1008, inventoryName: 'Printer', unit: 'pcs', quantityReceived: 2 },
                ],
            },
        ];
    }, []);

    // Filter and sort the data based on current filters
    const filteredData = useMemo(() => {
        let filtered = [...mockData];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.userName.toLowerCase().includes(searchLower) ||
                    user.userEmail.toLowerCase().includes(searchLower)
            );
        }

        // Apply department filter
        if (filters.departmentId) {
            filtered = filtered.filter((user) => {
                // In a real implementation, this would check against actual department IDs
                return user.departmentName.toLowerCase().includes('department');
            });
        }

        // Apply sorting
        if (filters.sortBy) {
            filtered.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;

                switch (filters.sortBy) {
                    case 'inventoryName':
                        aValue = a.userName;
                        bValue = b.userName;
                        break;
                    case 'quantityReceived':
                        aValue = a.totalQuantityReceived;
                        bValue = b.totalQuantityReceived;
                        break;
                    case 'inventoryCode':
                        aValue = a.userId;
                        bValue = b.userId;
                        break;
                    default:
                        return 0;
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return filters.sortOrder === 'desc'
                        ? bValue.localeCompare(aValue)
                        : aValue.localeCompare(bValue);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
                }

                return 0;
            });
        }

        return filtered;
    }, [mockData, filters]);

    const handleApplyFilters = (newFilters: UserReportFiltersType) => {
        setFilters(newFilters);
        setIsLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handleClearFilters = () => {
        setFilters({});
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Report</h1>
                    <p className="text-muted-foreground">
                        View inventory usage reports for all users in your department
                    </p>
                </div>
            </div>

            <UserReportFilters
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isLoading={isLoading}
            />

            <UserReportTable
                data={filteredData}
                isLoading={isLoading}
                searchTerm={filters.search}
            />

            {/* Backend Implementation Note */}
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
                    <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            Backend Implementation Required
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                            This page currently uses mock data. To fully implement this feature, the following Spring Boot endpoints need to be created:
                        </p>
                        <ul className="mt-2 list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                            <li><code>GET /api/reports/user/all</code> - Get all users with their report data</li>
                            {/* <li><code>GET /api/reports/user/department/{departmentId}</code> - Get users by department</li> */}
                            <li>Add search, sort, and filter parameters to the existing endpoints</li>
                            <li>Modify the query to return user information along with inventory data</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}