import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import type { AddStorekeeperFormData } from './StorekeeperFormValidation';

interface StorekeeperFormFieldsProps {
    departments: string[];
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    setValue: (value: string) => void;
}

export function StorekeeperFormFields({
    departments,
    open,
    setOpen,
    value,
    setValue,
}: StorekeeperFormFieldsProps) {
    const {
        register,
        formState: { errors },
        setValue: setFormValue,
    } = useFormContext<AddStorekeeperFormData>();

    return (
        <>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register('email')}
                    className="mt-1"
                />
                {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    {...register('firstName')}
                    className="mt-1"
                />
                {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.firstName.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    {...register('lastName')}
                    className="mt-1"
                />
                {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.lastName.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="departmentName" className="mb-1">
                    Department
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? departments.find((dept) => dept === value)
                                : 'Select department name...'}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search department name..."
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>
                                    No department name found.
                                </CommandEmpty>
                                <CommandGroup>
                                    {departments.map((dept) => (
                                        <CommandItem
                                            key={dept}
                                            value={dept}
                                            onSelect={(currentValue) => {
                                                const selectedValue =
                                                    currentValue === value
                                                        ? ''
                                                        : currentValue;
                                                setValue(selectedValue);
                                                setFormValue(
                                                    'departmentName',
                                                    selectedValue
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {dept}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    value === dept
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
