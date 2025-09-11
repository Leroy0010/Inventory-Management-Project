import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays } from 'lucide-react';

export default function DatePickerDemo() {
    const [singleDate, setSingleDate] = useState<Date | undefined>();
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const handleClearSingle = () => {
        setSingleDate(undefined);
    };

    const handleClearRange = () => {
        setStartDate(undefined);
        setEndDate(undefined);
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Date Picker Demo</h1>
                <p className="text-muted-foreground">
                    Demonstration of the shadcn-based date picker components
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Single Date Picker */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Single Date Picker
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select a date:</label>
                            <DatePicker
                                date={singleDate}
                                onDateChange={setSingleDate}
                                placeholder="Pick a date"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Selected: {singleDate ? singleDate.toLocaleDateString() : 'None'}
                        </div>
                        <Button variant="outline" onClick={handleClearSingle}>
                            Clear Date
                        </Button>
                    </CardContent>
                </Card>

                {/* Date Range Picker */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Date Range Picker
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select date range:</label>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                                startPlaceholder="Pick start date"
                                endPlaceholder="Pick end date"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <div>Start: {startDate ? startDate.toLocaleDateString() : 'None'}</div>
                            <div>End: {endDate ? endDate.toLocaleDateString() : 'None'}</div>
                        </div>
                        <Button variant="outline" onClick={handleClearRange}>
                            Clear Range
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle>Date Picker Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-2">Single Date Picker</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Calendar popup with month navigation</li>
                                <li>• Keyboard navigation support</li>
                                <li>• Accessible with ARIA labels</li>
                                <li>• Customizable placeholder text</li>
                                <li>• Disabled state support</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Date Range Picker</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Two connected date pickers</li>
                                <li>• Independent start/end selection</li>
                                <li>• Consistent styling and behavior</li>
                                <li>• Flexible layout options</li>
                                <li>• Form integration ready</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
