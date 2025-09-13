import { useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Search, Filter, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { officeApi } from '@/api/office';
import type { UserActivityReportFilters, UserRole } from '@/types/userActivityReport';

interface UserActivityReportFormProps {
  onGenerate: (filters: UserActivityReportFilters) => void;
  onExport?: (filters: UserActivityReportFilters) => void;
  isLoading?: boolean;
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

export function UserActivityReportForm({
  onGenerate,
  onExport,
  isLoading = false,
  className
}: UserActivityReportFormProps) {
  const [filters, setFilters] = useState<UserActivityReportFilters>({
    timePeriod: {
      type: 'year',
      year: new Date().getFullYear(),
    },
    includeSubmissions: true,
    includeApprovals: true,
    includeRejections: true,
    includeFulfillments: true,
    activeOnly: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch offices data
  const { data: offices = [], isLoading: officesLoading } = useQuery({
    queryKey: ['offices'],
    queryFn: officeApi.getOffices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert offices to combobox options
  const officeOptions: ComboboxOption[] = [
    { value: 'all', label: 'All Offices' },
    ...offices.map(office => ({
      value: office.id.toString(),
      label: office.name
    }))
  ];

  // Convert roles to combobox options
  const roleOptions: ComboboxOption[] = [
    { value: 'all', label: 'All Roles' },
    ...USER_ROLES.map(role => ({
      value: role.value,
      label: role.label
    }))
  ];

  const handleTimePeriodChange = (type: 'year' | 'dateRange') => {
    setFilters(prev => ({
      ...prev,
      timePeriod: {
        type,
        year: type === 'year' ? new Date().getFullYear() : undefined,
        startDate: type === 'dateRange' ? undefined : prev.timePeriod.startDate,
        endDate: type === 'dateRange' ? undefined : prev.timePeriod.endDate,
      }
    }));
  };

  const handleYearChange = (year: number) => {
    setFilters(prev => ({
      ...prev,
      timePeriod: {
        ...prev.timePeriod,
        year,
      }
    }));
  };

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      timePeriod: {
        ...prev.timePeriod,
        startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
      }
    }));
  };

  const handleFilterChange = (field: keyof UserActivityReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleActivityTypeChange = (type: keyof Pick<UserActivityReportFilters, 'includeSubmissions' | 'includeApprovals' | 'includeRejections' | 'includeFulfillments'>, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleGenerate = () => {
    onGenerate(filters);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(filters);
    }
  };

  const isFormValid = () => {
    if (filters.timePeriod.type === 'year') {
      return filters.timePeriod.year !== undefined;
    } else {
      return filters.timePeriod.startDate && filters.timePeriod.endDate;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          User Activity Report Filters
        </CardTitle>
        <CardDescription>
          Configure filters to generate a detailed user activity report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Period Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Time Period</Label>
          <div className="flex gap-4">
            <Button
              variant={filters.timePeriod.type === 'year' ? 'default' : 'outline'}
              onClick={() => handleTimePeriodChange('year')}
              size="sm"
            >
              By Year
            </Button>
            <Button
              variant={filters.timePeriod.type === 'dateRange' ? 'default' : 'outline'}
              onClick={() => handleTimePeriodChange('dateRange')}
              size="sm"
            >
              Date Range
            </Button>
          </div>

          {filters.timePeriod.type === 'year' && (
            <div className="w-48">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={filters.timePeriod.year || ''}
                onChange={(e) => handleYearChange(parseInt(e.target.value) || new Date().getFullYear())}
                min="2020"
                max={new Date().getFullYear() + 1}
              />
            </div>
          )}

          {filters.timePeriod.type === 'dateRange' && (
            <div>
              <Label>Date Range</Label>
              <DateRangePicker
                startDate={filters.timePeriod.startDate ? new Date(filters.timePeriod.startDate) : undefined}
                endDate={filters.timePeriod.endDate ? new Date(filters.timePeriod.endDate) : undefined}
                onStartDateChange={(date) => handleDateRangeChange(date, filters.timePeriod.endDate ? new Date(filters.timePeriod.endDate) : undefined)}
                onEndDateChange={(date) => handleDateRangeChange(filters.timePeriod.startDate ? new Date(filters.timePeriod.startDate) : undefined, date)}
                startPlaceholder="Pick start date"
                endPlaceholder="Pick end date"
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="office">Office</Label>
            <Combobox
              options={officeOptions}
              value={filters.officeId?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('officeId', value === 'all' ? undefined : parseInt(value))}
              placeholder="Select office..."
              searchPlaceholder="Search offices..."
              emptyText="No offices found."
              disabled={officesLoading}
              width="w-full"
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy || 'name'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select
                  value={filters.sortOrder || 'ASC'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value as 'ASC' | 'DESC')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASC">Ascending</SelectItem>
                    <SelectItem value="DESC">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="roleFilter">Role Filter</Label>
              <Combobox
                options={roleOptions}
                value={filters.roleFilter || 'all'}
                onValueChange={(value) => handleFilterChange('roleFilter', value === 'all' ? undefined : value as UserRole)}
                placeholder="Select role..."
                searchPlaceholder="Search roles..."
                emptyText="No roles found."
                width="w-full"
              />
            </div>

            {/* Activity Type Filters */}
            <div className="space-y-3">
              <Label>Include Activity Types</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSubmissions"
                    checked={filters.includeSubmissions}
                    onCheckedChange={(checked: boolean) => handleActivityTypeChange('includeSubmissions', checked)}
                  />
                  <Label htmlFor="includeSubmissions" className="text-sm">
                    Submissions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeApprovals"
                    checked={filters.includeApprovals}
                    onCheckedChange={(checked: boolean) => handleActivityTypeChange('includeApprovals', checked)}
                  />
                  <Label htmlFor="includeApprovals" className="text-sm">
                    Approvals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeRejections"
                    checked={filters.includeRejections}
                    onCheckedChange={(checked: boolean) => handleActivityTypeChange('includeRejections', checked)}
                  />
                  <Label htmlFor="includeRejections" className="text-sm">
                    Rejections
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFulfillments"
                    checked={filters.includeFulfillments}
                    onCheckedChange={(checked: boolean) => handleActivityTypeChange('includeFulfillments', checked)}
                  />
                  <Label htmlFor="includeFulfillments" className="text-sm">
                    Fulfillments
                  </Label>
                </div>
              </div>
            </div>

            {/* User Status Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="activeOnly"
                checked={filters.activeOnly}
                onCheckedChange={(checked: boolean) => handleFilterChange('activeOnly', checked)}
              />
              <Label htmlFor="activeOnly" className="text-sm">
                Show only active users
              </Label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid() || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
          {onExport && (
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
