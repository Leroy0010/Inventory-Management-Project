import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useUpdateOffice } from '@/hooks/queries/useOffice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Office } from '@/types/office';
import { OfficeEditModalHeader } from './OfficeEditModalHeader';
import { OfficeEditModalFields } from './OfficeEditModalFields';
import { OfficeEditModalActions } from './OfficeEditModalActions';

const editOfficeSchema = z.object({
    name: z.string().min(1, 'Office name is required'),
    location: z.string().optional(),
    description: z.string().optional(),
});

type EditOfficeFormData = z.infer<typeof editOfficeSchema>;

interface OfficeEditModalProps {
    office: Office | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OfficeEditModal({
    office,
    isOpen,
    onClose,
}: OfficeEditModalProps) {
    const updateOfficeMutation = useUpdateOffice();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditOfficeFormData>({
        resolver: zodResolver(editOfficeSchema),
    });

    // Reset form when office changes
    useEffect(() => {
        if (office) {
            reset({
                name: office.name,
                location: office.location || '',
                description: office.description || '',
            });
        }
    }, [office, reset]);

    const onSubmit = async (data: EditOfficeFormData) => {
        if (!office) return;

        setIsSubmitting(true);
        try {
            await updateOfficeMutation.mutateAsync({
                id: office.id,
                data: {
                    id: office.id,
                    name: data.name,
                    location: data.location || undefined,
                    description: data.description || undefined,
                },
            });
            onClose();
        } catch (error) {
            // Error is handled by the mutation
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!office) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <OfficeEditModalHeader />
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <OfficeEditModalFields
                        register={register}
                        errors={errors}
                    />

                    <OfficeEditModalActions
                        onClose={handleClose}
                        isSubmitting={isSubmitting}
                        isPending={updateOfficeMutation.isPending}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
