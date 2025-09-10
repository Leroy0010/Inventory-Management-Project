import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOfficeQueries } from '@/hooks/queries/useOffice';
import { useUserQueries } from '@/hooks/queries/useUser';
import { toast } from 'sonner';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface AddStaffFormProps {
    className?: string;
}
const addStaffSchema = z.object({
    email: z.email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    office: z.string().min(1, 'Office is required'),
});

type AddStaffFormData = z.infer<typeof addStaffSchema>;

export default function AddStaffForm({ className }: AddStaffFormProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    // Queries
    const { officeNamesQuery } = useOfficeQueries();
    const { createStaffMutation } = useUserQueries();

    // Get office names from API
    const offices = officeNamesQuery.data || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue: setFormValue,
        reset,
    } = useForm<AddStaffFormData>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            office: '',
        },
    });

    // Handle form submission
    const onSubmit = async (data: AddStaffFormData) => {
        try {
            await createStaffMutation.mutateAsync({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                officeName: data.office,
            });
            reset();
            setValue('');
            toast.success('Staff member created successfully!');
        } catch (error) {
            console.error('Error creating staff member:', error);
        }
    };

    return (
        <Card className={className}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter staff email"
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
                        <Label htmlFor="office" className="mb-1">
                            Office
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
                                        ? offices.find(
                                              (office) => office === value
                                          )
                                        : 'Select office...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search office..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No office found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {offices.map((office) => (
                                                <CommandItem
                                                    key={office}
                                                    value={office}
                                                    onSelect={(
                                                        currentValue
                                                    ) => {
                                                        const selectedValue = currentValue === value ? '' : currentValue;
                                                        setValue(selectedValue);
                                                        setFormValue('office', selectedValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {office}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            value === office
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

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Staff'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
