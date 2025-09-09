import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

// Validation schema
const createStorekeeperSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    departmentName: z.string().min(1, 'Department is required'),
});

type CreateStorekeeperFormData = z.infer<typeof createStorekeeperSchema>;

interface CreateStorekeeperFormProps {
    className?: string;
}

export default function CreateStorekeeperForm({
    className,
}: CreateStorekeeperFormProps) {
    const [departments, setDepartments] = useState<string[]>([
        'Finance Department',
        'IT Department',
        'Human Resources',
        'Operations',
    ]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateStorekeeperFormData>({
        resolver: zodResolver(createStorekeeperSchema),
    });

    return (
        <Card className={`${className}`}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(console.log)}
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
                        <Select
                            {...register('departmentName')}
                            defaultValue=""
                            onValueChange={() => {}}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>

                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting
                                ? 'Creating...'
                                : 'Create Storekeeper'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
