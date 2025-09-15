import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, X } from 'lucide-react';
import { useUpdateOffice } from '@/hooks/queries/useOffice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Office } from '@/types/office';

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

export function OfficeEditModal({ office, isOpen, onClose }: OfficeEditModalProps) {
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
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Edit Office
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              disabled={isSubmitting || updateOfficeMutation.isPending}
            >
              {isSubmitting || updateOfficeMutation.isPending ? 'Updating...' : 'Update Office'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
