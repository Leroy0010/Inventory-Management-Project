import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const addDepartmentSchema = z.object({
    name: z.string().min(1, 'Department name is required'),
    description: z.string().optional(),
});

type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;

interface AddDepartmentFormProps {
    className?: string;
}

export default function AddDepartmentForm({
    className,
}: AddDepartmentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddDepartmentFormData>({
        resolver: zodResolver(addDepartmentSchema),
    });

    return (
        <Card className={`${className}`}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit((data) => {
                        // Handle form submission
                        // TODO: Implement API call
                    })}
                >
                    <div>
                        <Label htmlFor="name">Department Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter department name"
                            {...register('name')}
                            className="mt-1"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            placeholder="Enter description (optional)"
                            {...register('description')}
                            className="mt-1"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Department'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
