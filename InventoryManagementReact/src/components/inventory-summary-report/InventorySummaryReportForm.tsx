import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { 
  InventorySummaryReportFilters,
  InventorySummaryType,
  CostFlowMethod 
} from '@/types/inventorySummaryReport';

// Form validation schema
const reportFormSchema = z.object({
  inventorySummaryType: z.enum(['BY_QUANTITY', 'BY_VALUE']),
  costFlowMethod: z.enum(['FIFO', 'AVG']).optional(),
  dateRange: z.object({
    type: z.enum(['year', 'yearRange', 'custom']),
    year: z.number().min(2000).max(2100).optional(),
    startYear: z.number().min(2000).max(2100).optional(),
    endYear: z.number().min(2000).max(2100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
}).refine((data) => {
  // Validate based on date range type
  if (data.dateRange.type === 'year') {
    return !!data.dateRange.year;
  }
  if (data.dateRange.type === 'yearRange') {
    return !!data.dateRange.startYear && !!data.dateRange.endYear && 
           data.dateRange.startYear <= data.dateRange.endYear;
  }
  if (data.dateRange.type === 'custom') {
    return !!data.dateRange.startDate && !!data.dateRange.endDate &&
           new Date(data.dateRange.startDate) <= new Date(data.dateRange.endDate);
  }
  return false;
}, {
  message: "Please provide valid date range parameters",
  path: ["dateRange"]
}).refine((data) => {
  // Cost flow method is required for value reports
  if (data.inventorySummaryType === 'BY_VALUE') {
    return !!data.costFlowMethod;
  }
  return true;
}, {
  message: "Cost flow method is required for value reports",
  path: ["costFlowMethod"]
});

type ReportFormData = z.infer<typeof reportFormSchema>;

interface InventorySummaryReportFormProps {
  onGenerate: (filters: InventorySummaryReportFilters) => void;
  onExport?: (filters: InventorySummaryReportFilters) => void;
  isLoading?: boolean;
  className?: string;
}

export default function InventorySummaryReportForm({
  onGenerate,
  onExport,
  isLoading = false,
  className
}: InventorySummaryReportFormProps) {
  const [dateRangeType, setDateRangeType] = useState<'year' | 'yearRange' | 'custom'>('year');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      inventorySummaryType: 'BY_QUANTITY',
      costFlowMethod: 'FIFO',
      dateRange: {
        type: 'year',
        year: new Date().getFullYear(),
      }
    }
  });

  const watchInventorySummaryType = form.watch('inventorySummaryType');
  const watchDateRangeType = form.watch('dateRange.type');

  const handleSubmit = (data: ReportFormData) => {
    const filters: InventorySummaryReportFilters = {
      inventorySummaryType: data.inventorySummaryType,
      costFlowMethod: data.costFlowMethod,
      dateRange: data.dateRange
    };
    onGenerate(filters);
  };

  const handleExport = () => {
    const data = form.getValues();
    const filters: InventorySummaryReportFilters = {
      inventorySummaryType: data.inventorySummaryType,
      costFlowMethod: data.costFlowMethod,
      dateRange: data.dateRange
    };
    onExport?.(filters);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Report Parameters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Report Type */}
            <FormField
              control={form.control}
              name="inventorySummaryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BY_QUANTITY">By Quantity</SelectItem>
                      <SelectItem value="BY_VALUE">By Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost Flow Method (only for value reports) */}
            {watchInventorySummaryType === 'BY_VALUE' && (
              <FormField
                control={form.control}
                name="costFlowMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Flow Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cost flow method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FIFO">FIFO (First-In, First-Out)</SelectItem>
                        <SelectItem value="AVG">Average Weighted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Date Range Type */}
            <FormField
              control={form.control}
              name="dateRange.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setDateRangeType(value as 'year' | 'yearRange' | 'custom');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="year">Single Year</SelectItem>
                      <SelectItem value="yearRange">Year Range</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Single Year */}
            {watchDateRangeType === 'year' && (
              <FormField
                control={form.control}
                name="dateRange.year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2024"
                        min="2000"
                        max="2100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Year Range */}
            {watchDateRangeType === 'yearRange' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateRange.startYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2023"
                          min="2000"
                          max="2100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange.endYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2024"
                          min="2000"
                          max="2100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Custom Date Range */}
            {watchDateRangeType === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateRange.startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString().split('T')[0] : '');
                              setStartDateOpen(false);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange.endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString().split('T')[0] : '');
                              setEndDateOpen(false);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
              {onExport && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleExport}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
