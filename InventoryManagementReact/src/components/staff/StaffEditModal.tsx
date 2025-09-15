import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, X } from 'lucide-react';
import { useUpdateStaff } from '@/hooks/queries/useStaff';
import { useOffices } from '@/hooks/queries/useOffice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Staff } from '@/types/staff';

const editStaffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  officeName: z.string().optional(),
});

type EditStaffFormData = z.infer<typeof editStaffSchema>;

interface StaffEditModalProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffEditModal({ staff, isOpen, onClose }: StaffEditModalProps) {
  const updateStaffMutation = useUpdateStaff();
  const { data: offices = [] } = useOffices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditStaffFormData>({
    resolver: zodResolver(editStaffSchema),
  });

  const selectedOfficeName = watch('officeName');

  // Reset form when staff changes
  useEffect(() => {
    if (staff) {
      reset({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone || '',
        bio: staff.bio || '',
        officeName: staff.officeName || '',
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
          officeName: data.officeName || undefined,
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

  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Staff Member
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="Enter phone number"
              />
            </div>

            {/* Office */}
            <div>
              <Label htmlFor="officeName">Office</Label>
              <Select
                value={selectedOfficeName || ''}
                onValueChange={(value) => setValue('officeName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Office</SelectItem>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.name}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Enter bio"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateStaffMutation.isPending}
            >
              {isSubmitting || updateStaffMutation.isPending ? 'Updating...' : 'Update Staff'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
