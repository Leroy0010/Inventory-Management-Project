import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, X } from 'lucide-react';
import { useUpdateStaff } from '@/hooks/queries/useStaff';
import { useOfficeNames } from '@/hooks/queries/useOffice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Staff } from '@/types/staff';
import type { ComboboxOption } from '@/components/ui/combobox';
import { StaffEditModalHeader } from './StaffEditModalHeader';
import { StaffEditModalFields } from './StaffEditModalFields';
import { StaffEditModalActions } from './StaffEditModalActions';

const editStaffSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().optional(),
    bio: z.string().optional(),
    office: z.string().min(1, 'Office is required'),
});

type EditStaffFormData = z.infer<typeof editStaffSchema>;

interface StaffEditModalProps {
    staff: Staff | null;
    isOpen: boolean;
    onClose: () => void;
}

export function StaffEditModal({
    staff,
    isOpen,
    onClose,
}: StaffEditModalProps) {
    const updateStaffMutation = useUpdateStaff();
    const { data: offices = [] } = useOfficeNames();
    const [office, setOffice] = useState('');
    const officeOptions: ComboboxOption[] =
        offices?.map((office) => ({
            value: office,
            label: office,
        })) || [];
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue: setFormValue,
        watch,
        formState: { errors },
    } = useForm<EditStaffFormData>({
        resolver: zodResolver(editStaffSchema),
    });

    const selectedOfficeName = watch('office');

    // Reset form when staff changes
    useEffect(() => {
        if (staff) {
            reset({
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                phone: staff.phone || '',
                bio: staff.bio || '',
                office: staff.officeName,
            });
        }
    }, [staff, reset]);

    const onSubmit = async (data: EditStaffFormData) => {
        if (!staff) return;

        setIsSubmitting(true);
        try {
            await updateStaffMutation.mutateAsync({
                id: staff.id,
                data: {
                    id: staff.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone || undefined,
                    bio: data.bio || undefined,
                    officeName: data.office,
                },
            });
            setOffice('');
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

    if (!staff) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <StaffEditModalHeader />
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <StaffEditModalFields
                        register={register}
                        errors={errors}
                        setFormValue={setFormValue}
                        office={office}
                        setOffice={setOffice}
                        officeOptions={officeOptions}
                    />

                    <StaffEditModalActions
                        onClose={handleClose}
                        isSubmitting={isSubmitting}
                        isPending={updateStaffMutation.isPending}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
