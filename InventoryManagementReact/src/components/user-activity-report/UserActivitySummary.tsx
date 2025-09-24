import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Users,
    UserCheck,
    UserX,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Building,
    Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    UserActivitySummaryDto,
    TopRequesterDto,
    OfficeActivityDto,
} from '@/types/userActivityReport';

interface UserActivitySummaryProps {
    summary: UserActivitySummaryDto;
    className?: string;
}

export function UserActivitySummary({
    summary,
    className,
}: UserActivitySummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    const getStatusColor = (rate: number) => {
        if (rate >= 0.8) return 'text-green-600';
        if (rate >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (rate: number) => {
        if (rate >= 0.8) return 'bg-green-500';
        if (rate >= 0.6) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.totalUsers}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <UserCheck className="h-3 w-3 text-green-500" />
                            <span>{summary.activeUsers} active</span>
                            <UserX className="h-3 w-3 text-gray-500" />
                            <span>{summary.inactiveUsers} inactive</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Requests
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.totalRequestsSubmitted}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>
                                {summary.totalRequestsApproved} approved
                            </span>
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span>
                                {summary.totalRequestsRejected} rejected
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Approval Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                getStatusColor(summary.overallApprovalRate)
                            )}
                        >
                            {formatPercentage(summary.overallApprovalRate)}
                        </div>
                        <Progress
                            value={summary.overallApprovalRate * 100}
                            className="mt-2"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Items
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.totalRequestsSubmitted}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Approved: {summary.totalRequestsApproved}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Performance Metrics
                        </CardTitle>
                        <CardDescription>
                            Key performance indicators
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Average Requests per User</span>
                                <span className="font-medium">
                                    {summary.averageRequestsPerUser.toFixed(1)}
                                </span>
                            </div>
                            <Progress
                                value={
                                    (summary.averageRequestsPerUser / 10) * 100
                                }
                                className="h-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Overall Rejection Rate</span>
                                <span
                                    className={cn(
                                        'font-medium',
                                        getStatusColor(
                                            summary.overallRejectionRate
                                        )
                                    )}
                                >
                                    {formatPercentage(
                                        summary.overallRejectionRate
                                    )}
                                </span>
                            </div>
                            <Progress
                                value={summary.overallRejectionRate * 100}
                                className={cn(
                                    'h-2',
                                    getProgressColor(
                                        summary.overallRejectionRate
                                    )
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Fulfillment Rate</span>
                                <span
                                    className={cn(
                                        'font-medium',
                                        getStatusColor(
                                            summary.overallFulfillmentRate
                                        )
                                    )}
                                >
                                    {formatPercentage(
                                        summary.overallFulfillmentRate
                                    )}
                                </span>
                            </div>
                            <Progress
                                value={summary.overallFulfillmentRate * 100}
                                className={cn(
                                    'h-2',
                                    getProgressColor(
                                        summary.overallFulfillmentRate
                                    )
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            User Distribution
                        </CardTitle>
                        <CardDescription>
                            Breakdown by role and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Staff Users</span>
                                </div>
                                <Badge variant="secondary">
                                    {summary.staffUsers}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm">
                                        Storekeeper Users
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm">
                                        Active Users
                                    </span>
                                </div>
                                <Badge variant="secondary">
                                    {summary.activeUsers}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                    <span className="text-sm">
                                        Inactive Users
                                    </span>
                                </div>
                                <Badge variant="secondary">
                                    {summary.inactiveUsers}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            {summary.topRequesters && summary.topRequesters.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Top Requesters
                        </CardTitle>
                        <CardDescription>
                            Users with highest request activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {summary.topRequesters
                                .slice(0, 5)
                                .map((requester, index) => (
                                    <div
                                        key={requester.userId}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {requester.fullName}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Building className="h-3 w-3" />
                                                    {requester.officeName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {requester.requestCount}{' '}
                                                requests
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {requester.itemCount} items
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Office Activity */}
            {summary.officeActivity && summary.officeActivity.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Office Activity
                        </CardTitle>
                        <CardDescription>
                            Activity breakdown by office
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {summary.officeActivity.map((office) => (
                                <div
                                    key={office.officeId}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Building className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">
                                                {office.officeName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {office.userCount} users
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">
                                            {office.requestCount} requests
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {office.itemCount} items •{' '}
                                            {office.averageRequestsPerUser.toFixed(
                                                1
                                            )}{' '}
                                            avg/user
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
