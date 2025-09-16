import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import { useUserQueries } from '@/hooks/queries/useUser';
import { toast } from 'sonner';
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

// Validation schema
const addStorekeeperSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    departmentName: z.string().min(1, 'Department is required'),
});

type AddStorekeeperFormData = z.infer<typeof addStorekeeperSchema>;

interface AddStorekeeperFormProps {
    className?: string;
}

export default function AddStorekeeperForm({
    className,
}: AddStorekeeperFormProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    // Queries
    const { departmentsQuery } = useDepartmentQueries();
    const { createStorekeeperMutation } = useUserQueries();

    // Get department names from API
    const departments = departmentsQuery.data?.map(dept => dept.name) || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue: setFormValue,
        reset,
    } = useForm<AddStorekeeperFormData>({
        resolver: zodResolver(addStorekeeperSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            departmentName: '',
        },
    });

    // Handle form submission
    const onSubmit = async (data: AddStorekeeperFormData) => {
        try {
            await createStorekeeperMutation.mutateAsync({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                departmentName: data.departmentName,
                roleName: 'STOREKEEPER'
            });
            reset();
            setValue('');
            toast.success('Storekeeper created successfully!');
        } catch (error) {
            // Error creating storekeeper
        }
    };

    return (
        <Card className={`${className}`}>
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
                                        ? departments.find(
                                              (dept) => dept === value
                                          )
                                        : 'Select itemName...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search itemName..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No itemName found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {departments.map((dept) => (
                                                <CommandItem
                                                    key={dept}
                                                    value={dept}
                                                    onSelect={(
                                                        currentValue
                                                    ) => {
                                                        const selectedValue = currentValue === value ? '' : currentValue;
                                                        setValue(selectedValue);
                                                        setFormValue('departmentName', selectedValue);
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
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Storekeeper'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
