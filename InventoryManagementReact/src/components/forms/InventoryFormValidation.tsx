import { z } from 'zod';

// Enhanced validation schema
export const addInventorySchema = z.object({
  name: z
    .string()
    .min(1, 'Inventory name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .min(2, 'Unit must be at least 2 characters')
    .max(20, 'Unit must be less than 20 characters'),
  reorderLevel: z
    .number()
    .min(1, 'Reorder level must be at least 1')
    .max(10000, 'Reorder level must be less than 10,000'),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (file instanceof File) {
        const validTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];
        return validTypes.includes(file.type);
      }
      return false;
    }, 'Please upload a valid image file (JPEG, PNG, WebP)')
    .refine((file) => {
      if (!file) return true; // Optional field
      if (file instanceof File) {
        return file.size <= 5 * 1024 * 1024; // 5MB max
      }
      return false;
    }, 'Image size must be less than 5MB'),
});

export type AddInventoryFormData = z.infer<typeof addInventorySchema>;
