import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateOffice } from '@/hooks/queries/useOffice';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const createOfficeMutation = useCreateOffice();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddOfficeFormData>({
        resolver: zodResolver(addOfficeSchema),
    });

    const onSubmit = async (data: AddOfficeFormData) => {
        try {
            await createOfficeMutation.mutateAsync(data);
            navigate('/office');
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <Card className={`${classname}`}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
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
                        disabled={isSubmitting || createOfficeMutation.isPending}
                        className="cursor-pointer"
                    >
                        {isSubmitting || createOfficeMutation.isPending ? 'Adding...' : 'Add Office'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
