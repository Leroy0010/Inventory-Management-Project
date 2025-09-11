import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  align = 'start',
  sideOffset = 4,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} sideOffset={sideOffset}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = 'Pick start date',
  endPlaceholder = 'Pick end date',
  disabled = false,
  className,
  align = 'start',
  sideOffset = 4,
}: DateRangePickerProps) {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const handleStartSelect = (selectedDate: Date | undefined) => {
    onStartDateChange?.(selectedDate);
    setStartOpen(false);
  };

  const handleEndSelect = (selectedDate: Date | undefined) => {
    onEndDateChange?.(selectedDate);
    setEndOpen(false);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !startDate && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, 'PPP') : startPlaceholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align} sideOffset={sideOffset}>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !endDate && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, 'PPP') : endPlaceholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align} sideOffset={sideOffset}>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
