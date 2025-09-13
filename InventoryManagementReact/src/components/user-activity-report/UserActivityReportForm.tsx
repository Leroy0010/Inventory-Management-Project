import { useState,} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { UserActivityReportFilters, UserRole } from '@/types/userActivityReport';

interface UserActivityReportFormProps {
  onGenerate: (filters: UserActivityReportFilters) => void;
  onExport?: (filters: UserActivityReportFilters) => void;
  isLoading?: boolean;
  offices?: Array<{ id: number; name: string }>;
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
  offices = [],
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

  const handleDateRangeChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      timePeriod: {
        ...prev.timePeriod,
        [field]: date ? date.toISOString().split('T')[0] : undefined,
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.timePeriod.startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.timePeriod.startDate ? (
                        format(new Date(filters.timePeriod.startDate), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.timePeriod.startDate ? new Date(filters.timePeriod.startDate) : undefined}
                      onSelect={(date) => handleDateRangeChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.timePeriod.endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.timePeriod.endDate ? (
                        format(new Date(filters.timePeriod.endDate), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.timePeriod.endDate ? new Date(filters.timePeriod.endDate) : undefined}
                      onSelect={(date) => handleDateRangeChange('endDate', date)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
            <Select
              value={filters.officeId?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('officeId', value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All offices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All offices</SelectItem>
                {offices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Select
                value={filters.roleFilter || 'all'}
                onValueChange={(value) => handleFilterChange('roleFilter', value === 'all' ? undefined : value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
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
