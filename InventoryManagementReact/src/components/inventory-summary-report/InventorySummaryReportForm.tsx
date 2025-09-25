import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { InventorySummaryReportFilters } from '@/types/inventorySummaryReport';
import { useOffices } from '@/hooks/queries/useOffice';
import { ReportTypeSelector } from './ReportTypeSelector';
import { OfficeFilter } from './OfficeFilter';
import { CostFlowMethodSelector } from './CostFlowMethodSelector';
import { DateRangeTypeSelector } from './DateRangeTypeSelector';
import { SingleYearSelector } from './SingleYearSelector';
import { YearRangeSelector } from './YearRangeSelector';
import { CustomDateRangeSelector } from './CustomDateRangeSelector';
import { ReportActionButtons } from './ReportActionButtons';
import type { ComboboxOption } from '@/components/ui/combobox';

// Form validation schema
const reportFormSchema = z
    .object({
        inventorySummaryType: z.enum(['BY_QUANTITY', 'BY_VALUE']),
        costFlowMethod: z.enum(['FIFO', 'AVG']).optional(),
        officeId: z.number().optional(),
        dateRange: z.object({
            type: z.enum(['year', 'yearRange', 'custom']),
            year: z.number().min(2000).max(2100).optional(),
            startYear: z.number().min(2000).max(2100).optional(),
            endYear: z.number().min(2000).max(2100).optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
        }),
    })
    .refine(
        (data) => {
            // Validate based on date range type
            if (data.dateRange.type === 'year') {
                return !!data.dateRange.year;
            }
            if (data.dateRange.type === 'yearRange') {
                return (
                    !!data.dateRange.startYear &&
                    !!data.dateRange.endYear &&
                    data.dateRange.startYear <= data.dateRange.endYear
                );
            }
            if (data.dateRange.type === 'custom') {
                return (
                    !!data.dateRange.startDate &&
                    !!data.dateRange.endDate &&
                    data.dateRange.startDate <= data.dateRange.endDate
                );
            }
            return false;
        },
        {
            message: 'Please provide valid date range parameters',
            path: ['dateRange'],
        }
    )
    .refine(
        (data) => {
            // Cost flow method is required for value reports
            if (data.inventorySummaryType === 'BY_VALUE') {
                return !!data.costFlowMethod;
            }
            return true;
        },
        {
            message: 'Cost flow method is required for value reports',
            path: ['costFlowMethod'],
        }
    );

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
    className,
}: InventorySummaryReportFormProps) {
    const [dateRangeType, setDateRangeType] = useState<
        'year' | 'yearRange' | 'custom'
    >('year');

    // Fetch offices data
    const { data: offices = [], isLoading: officesLoading } = useOffices();

    // Convert offices to combobox options
    const officeOptions: ComboboxOption[] = [
        { value: 'all', label: 'All Offices' },
        ...offices.map((office) => ({
            value: office.id.toString(),
            label: office.name,
        })),
    ];

    const form = useForm<ReportFormData>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            inventorySummaryType: 'BY_QUANTITY',
            costFlowMethod: 'FIFO',
            officeId: undefined,
            dateRange: {
                type: 'year',
                year: new Date().getFullYear(),
            },
        },
    });

    const watchInventorySummaryType = form.watch('inventorySummaryType');
    const watchDateRangeType = form.watch('dateRange.type');

    const handleSubmit = (data: ReportFormData) => {
        const filters: InventorySummaryReportFilters = {
            inventorySummaryType: data.inventorySummaryType,
            costFlowMethod: data.costFlowMethod,
            officeId: data.officeId,
            dateRange: {
                ...data.dateRange,
                // Convert Date objects to ISO strings for custom date range
                startDate: data.dateRange.startDate
                    ?.toISOString()
                    .split('T')[0],
                endDate: data.dateRange.endDate?.toISOString().split('T')[0],
            },
        };
        onGenerate(filters);
    };

    const handleExport = () => {
        const data = form.getValues();
        const filters: InventorySummaryReportFilters = {
            inventorySummaryType: data.inventorySummaryType,
            costFlowMethod: data.costFlowMethod,
            officeId: data.officeId,
            dateRange: {
                ...data.dateRange,
                // Convert Date objects to ISO strings for custom date range
                startDate: data.dateRange.startDate
                    ?.toISOString()
                    .split('T')[0],
                endDate: data.dateRange.endDate?.toISOString().split('T')[0],
            },
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
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex space-x-20">
                            <ReportTypeSelector form={form} />
                            <OfficeFilter
                                form={form}
                                officeOptions={officeOptions}
                                isLoading={officesLoading}
                            />
                        </div>

                        <CostFlowMethodSelector
                            form={form}
                            show={watchInventorySummaryType === 'BY_VALUE'}
                        />

                        <DateRangeTypeSelector
                            form={form}
                            onTypeChange={setDateRangeType}
                        />

                        <SingleYearSelector
                            form={form}
                            show={watchDateRangeType === 'year'}
                        />

                        <YearRangeSelector
                            form={form}
                            show={watchDateRangeType === 'yearRange'}
                        />

                        <CustomDateRangeSelector
                            form={form}
                            show={watchDateRangeType === 'custom'}
                        />

                        <ReportActionButtons
                            isLoading={isLoading}
                            onExport={onExport ? handleExport : undefined}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
