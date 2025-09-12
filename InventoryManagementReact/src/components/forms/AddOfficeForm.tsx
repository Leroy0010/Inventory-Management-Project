import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface AddOfficeFormProps {
    classname?: string;
}

const addOfficeSchema = z.object({
    name: z.string().min(1, 'Office name is required'),
    location: z.string().optional(),
    description: z.string().optional(),
});

type AddOfficeFormData = z.infer<typeof addOfficeSchema>;

export default function AddOfficeForm({ classname }: AddOfficeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddOfficeFormData>({
        resolver: zodResolver(addOfficeSchema),
    });

    return (
        <Card className={`${classname}`}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(console.log)}
                >
                    <div>
                        <Label htmlFor="name">Office Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter office name"
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
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            type="text"
                            placeholder="Enter location (optional)"
                            {...register('location')}
                            className="mt-1"
                        />
                        {errors.location && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.location.message}
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
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Office'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
