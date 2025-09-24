import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface EditOfficeFormData {
    name: string;
    location?: string;
    description?: string;
}

interface OfficeEditModalFieldsProps {
    register: UseFormRegister<EditOfficeFormData>;
    errors: FieldErrors<EditOfficeFormData>;
}

export function OfficeEditModalFields({
    register,
    errors,
}: OfficeEditModalFieldsProps) {
    return (
        <div className="space-y-4">
            {/* Office Name */}
            <div>
                <Label htmlFor="name">Office Name *</Label>
                <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Enter office name"
                />
                {errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Location */}
            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    type="text"
                    {...register('location')}
                    placeholder="Enter office location"
                />
            </div>

            {/* Description */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter office description"
                    rows={4}
                    className="resize-none"
                />
            </div>
        </div>
    );
}
