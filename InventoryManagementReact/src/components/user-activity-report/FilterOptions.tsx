import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Search, Filter, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    UserActivityReportFilters,
    UserRole,
} from '@/types/userActivityReport';

interface FilterOptionsProps {
    filters: UserActivityReportFilters;
    onFilterChange: (
        field: keyof UserActivityReportFilters,
        value: any
    ) => void;
    onActivityTypeChange: (
        type: keyof Pick<
            UserActivityReportFilters,
            | 'includeSubmissions'
            | 'includeApprovals'
            | 'includeRejections'
            | 'includeFulfillments'
        >,
        checked: boolean
    ) => void;
    officeOptions: ComboboxOption[];
    roleOptions: ComboboxOption[];
    className?: string;
}

const USER_ROLES: { value: UserRole; label: string }[] = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'STOREKEEPER', label: 'Storekeeper' },
    { value: 'STAFF', label: 'Staff' },
];

const SORT_OPTIONS = [
    { value: 'name', label: 'Name' },
    { value: 'requests', label: 'Total Requests' },
    { value: 'lastActivity', label: 'Last Activity' },
    { value: 'approvalRate', label: 'Approval Rate' },
    { value: 'officeName', label: 'Office' },
];

export function FilterOptions({
    filters,
    onFilterChange,
    onActivityTypeChange,
    officeOptions,
    roleOptions,
    className,
}: FilterOptionsProps) {
    return (
        <Card className={cn('w-full', className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Options
                </CardTitle>
                <CardDescription>
                    Refine your report with additional filters
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Office Filter */}
                <div className="space-y-2">
                    <Label>Office</Label>
                    <Combobox
                        options={officeOptions}
                        value={filters.officeId?.toString() || 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'officeId',
                                value === 'all' ? undefined : parseInt(value)
                            )
                        }
                        placeholder="Select office..."
                        searchPlaceholder="Search offices..."
                    />
                </div>

                {/* Role Filter */}
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Combobox
                        options={roleOptions}
                        value={filters.roleFilter || 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'roleFilter',
                                value === 'all'
                                    ? undefined
                                    : (value as UserRole)
                            )
                        }
                        placeholder="Select role..."
                        searchPlaceholder="Search roles..."
                    />
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                    <Label htmlFor="sortBy">Sort By</Label>
                    <Select
                        value={filters.sortBy || 'name'}
                        onValueChange={(value) =>
                            onFilterChange('sortBy', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select sort field" />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Select
                        value={filters.sortOrder || 'ASC'}
                        onValueChange={(value) =>
                            onFilterChange('sortOrder', value as 'ASC' | 'DESC')
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select sort order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ASC">Ascending</SelectItem>
                            <SelectItem value="DESC">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* User Status */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User Status
                    </Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activeOnly"
                                checked={filters.activeOnly}
                                onCheckedChange={(checked) =>
                                    onFilterChange('activeOnly', checked)
                                }
                            />
                            <Label
                                htmlFor="activeOnly"
                                className="text-sm font-normal"
                            >
                                Show only active users
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Activity Types */}
                <div className="space-y-3">
                    <Label>Activity Types</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeSubmissions"
                                checked={filters.includeSubmissions}
                                onCheckedChange={(checked) =>
                                    onActivityTypeChange(
                                        'includeSubmissions',
                                        checked as boolean
                                    )
                                }
                            />
                            <Label
                                htmlFor="includeSubmissions"
                                className="text-sm font-normal"
                            >
                                Include submissions
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeApprovals"
                                checked={filters.includeApprovals}
                                onCheckedChange={(checked) =>
                                    onActivityTypeChange(
                                        'includeApprovals',
                                        checked as boolean
                                    )
                                }
                            />
                            <Label
                                htmlFor="includeApprovals"
                                className="text-sm font-normal"
                            >
                                Include approvals
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeRejections"
                                checked={filters.includeRejections}
                                onCheckedChange={(checked) =>
                                    onActivityTypeChange(
                                        'includeRejections',
                                        checked as boolean
                                    )
                                }
                            />
                            <Label
                                htmlFor="includeRejections"
                                className="text-sm font-normal"
                            >
                                Include rejections
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeFulfillments"
                                checked={filters.includeFulfillments}
                                onCheckedChange={(checked) =>
                                    onActivityTypeChange(
                                        'includeFulfillments',
                                        checked as boolean
                                    )
                                }
                            />
                            <Label
                                htmlFor="includeFulfillments"
                                className="text-sm font-normal"
                            >
                                Include fulfillments
                            </Label>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
